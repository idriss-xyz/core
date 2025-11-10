import {
  AppDataSource,
  Creator,
  CreatorNetwork,
  CreatorToken,
  DonationParameters,
  CreatorAddress,
  CreatorProfileView,
} from '@idriss-xyz/db';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import {
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  MAIN_LANDING_LINK,
  CREATOR_CHAIN,
  CHAIN_ID_TO_TOKENS,
} from '@idriss-xyz/constants';
import { Hex } from 'viem';
import { ILike } from 'typeorm';
import {
  fetchTwitchStreamStatus,
  fetchTwitchUserInfo,
} from '@idriss-xyz/utils/server';

interface EnrichedCreatorProfile extends CreatorProfileView {
  streamStatus?: boolean;
}
const DEFAULT_SUPPORTED_TOKEN_SYMBOLS: string[] = Array.from(
  new Set(
    Object.values(CHAIN_ID_TO_TOKENS)
      .flat()
      .map((t) => t.symbol),
  ),
);

class CreatorProfileService {
  private profileRepository = AppDataSource.getRepository(CreatorProfileView);
  private creatorRepository = AppDataSource.getRepository(Creator);

  async createCreatorProfile(req: Request) {
    const {
      minimumAlertAmount = DEFAULT_DONATION_MIN_ALERT_AMOUNT,
      minimumTTSAmount = DEFAULT_DONATION_MIN_TTS_AMOUNT,
      minimumSfxAmount = DEFAULT_DONATION_MIN_SFX_AMOUNT,
      voiceId,
      alertSound,
      alertEnabled,
      ttsEnabled,
      sfxEnabled,
      collectibleEnabled = true,
      tokenEnabled = true,
      customBadWords = [],
      tokens = DEFAULT_SUPPORTED_TOKEN_SYMBOLS,
      networks = Object.values(CREATOR_CHAIN).map((chain) => chain.shortName),
      isDonor = false,
      ...creatorData
    } = req.body;

    const donationParameters = new DonationParameters();
    donationParameters.minimumAlertAmount = minimumAlertAmount;
    donationParameters.minimumTTSAmount = minimumTTSAmount;
    donationParameters.minimumSfxAmount = minimumSfxAmount;
    donationParameters.voiceId = voiceId;
    donationParameters.alertSound = alertSound;
    donationParameters.alertEnabled = alertEnabled;
    donationParameters.ttsEnabled = ttsEnabled;
    donationParameters.sfxEnabled = sfxEnabled;
    donationParameters.collectibleEnabled = collectibleEnabled;
    donationParameters.tokenEnabled = tokenEnabled;
    donationParameters.customBadWords = Array.isArray(customBadWords)
      ? customBadWords
      : [];

    const creatorRepository = AppDataSource.getRepository(Creator);
    const donationParamsRepository =
      AppDataSource.getRepository(DonationParameters);
    const tokenRepository = AppDataSource.getRepository(CreatorToken);
    const networkRepository = AppDataSource.getRepository(CreatorNetwork);

    const creator = new Creator();
    creator.doneSetup = false;
    creator.address = creatorData.address as Hex;
    creator.primaryAddress =
      (creatorData.primaryAddress as Hex) ?? (creatorData.address as Hex);
    creator.name = creatorData.name;
    creator.displayName = creatorData.displayName ?? creatorData.name;
    creator.profilePictureUrl = creatorData.profilePictureUrl;
    creator.privyId = req.user.id;
    creator.email = creatorData.email;
    creator.donationUrl = `${MAIN_LANDING_LINK}/${creatorData.name}`;
    const obsUrlSecret = randomBytes(24).toString('base64url');
    creator.obsUrl = `${MAIN_LANDING_LINK}/alert-overlay/${obsUrlSecret}`;
    creator.goalUrl = `${MAIN_LANDING_LINK}/goal-overlay/${obsUrlSecret}`;
    creator.isDonor = isDonor;

    // Create and save new creator
    const savedCreator = await creatorRepository.save(creator);

    donationParameters.customBadWords = customBadWords;
    donationParameters.collectibleEnabled = collectibleEnabled;
    donationParameters.tokenEnabled = tokenEnabled;
    donationParameters.creator = savedCreator;

    // Create and save donation parameters with creator reference
    const savedDonationParameters =
      await donationParamsRepository.save(donationParameters);

    // Create token records
    const tokenEntities = tokens.map((tokenSymbol: string) => {
      const token = new CreatorToken();
      token.tokenSymbol = tokenSymbol;
      token.creator = savedCreator;
      return token;
    });
    await tokenRepository.save(tokenEntities);

    // Create network records
    const networkEntities = networks.map((chainName: string) => {
      const network = new CreatorNetwork();
      network.chainName = chainName;
      network.creator = savedCreator;
      return network;
    });
    await networkRepository.save(networkEntities);

    return {
      savedCreator,
      savedDonationParameters,
      tokenEntities,
      networkEntities,
    };
  }

  async getProfileByName(name: string): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({
      where: { name: ILike(name) },
    });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  async getProfileById(id: number): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  async getProfileByAddress(
    address: string,
  ): Promise<EnrichedCreatorProfile | null> {
    let profile = await this.profileRepository.findOne({
      where: { address },
    });
    if (!profile) {
      const creatorAddressRepository =
        AppDataSource.getRepository(CreatorAddress);
      const secondaryAddress = await creatorAddressRepository.findOne({
        where: { address: address as Hex },
        relations: ['creator'],
      });
      if (secondaryAddress) {
        profile = await this.profileRepository.findOne({
          where: { id: secondaryAddress.creator.id },
        });
      }
    }
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  private async enrichWithTwitchData(
    profile: CreatorProfileView,
  ): Promise<EnrichedCreatorProfile> {
    if (!profile.name) {
      return profile;
    }

    try {
      const [streamInfo, userInfo] = await Promise.all([
        fetchTwitchStreamStatus(profile.name),
        fetchTwitchUserInfo(profile.name),
      ]);

      if (
        userInfo?.profile_image_url &&
        userInfo.profile_image_url !== profile.profilePictureUrl
      ) {
        await this.updateProfilePicture(profile.id, userInfo.profile_image_url);
        profile.profilePictureUrl = userInfo.profile_image_url;
      }

      return {
        ...profile,
        streamStatus: streamInfo.isLive,
      };
    } catch (error) {
      console.error('Error enriching profile with Twitch data:', error);
      return profile;
    }
  }

  // Update profile picture if it has changed
  private async updateProfilePicture(
    creatorId: number,
    profilePictureUrl: string,
  ): Promise<void> {
    try {
      await this.creatorRepository.update(
        { id: creatorId },
        { profilePictureUrl },
      );
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  }
}

// Export a singleton instance
export const creatorProfileService = new CreatorProfileService();
