import { AppDataSource } from '../db/database';
import {
  Creator,
  CreatorNetwork,
  CreatorToken,
  DonationParameters,
} from '../db/entities';
import { CreatorProfileView } from '../db/views';
import {
  fetchTwitchUserInfo,
  fetchTwitchStreamStatus,
} from '../utils/twitch-api';
import { Request, Response } from 'express';
import {
  CREATORS_LINK,
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
} from '@idriss-xyz/constants';
import { Hex } from 'viem';

interface EnrichedCreatorProfile extends CreatorProfileView {
  streamStatus?: boolean;
}

class CreatorProfileService {
  private profileRepository = AppDataSource.getRepository(CreatorProfileView);
  private creatorRepository = AppDataSource.getRepository(Creator);

  async getProfileByName(name: string): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({ where: { name } });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

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
      customBadWords = [],
      tokens = [],
      networks = [],
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
    donationParameters.customBadWords = customBadWords;

    const creatorRepository = AppDataSource.getRepository(Creator);
    const donationParamsRepository =
      AppDataSource.getRepository(DonationParameters);
    const tokenRepository = AppDataSource.getRepository(CreatorToken);
    const networkRepository = AppDataSource.getRepository(CreatorNetwork);

    const creator = new Creator();
    creator.address = creatorData.address as Hex;
    creator.primaryAddress =
      (creatorData.primaryAddress as Hex) ?? (creatorData.address as Hex);
    creator.name = creatorData.name;
    creator.displayName = creatorData.displayName;
    creator.profilePictureUrl = creatorData.profilePictureUrl;
    creator.privyId = creatorData.privyId;
    creator.donationUrl = `${CREATORS_LINK}/${creatorData.name}`;
    creator.obsUrl = `${CREATORS_LINK}/obs/${creatorData.name}`;

    // Create and save new creator
    const savedCreator = await creatorRepository.save(creator);

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

  async getProfileById(id: number): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  async getProfileByAddress(
    address: string,
  ): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({
      where: { address },
    });
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
