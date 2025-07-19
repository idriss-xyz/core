import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { AppDataSource } from '../db/database';
import {
  Creator,
  DonationParameters,
  CreatorToken,
  CreatorNetwork, Referral,
} from '../db/entities';
import { Hex } from 'viem';

import {
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  CREATORS_LINK,
} from '@idriss-xyz/constants';
import { verifyToken } from '../db/middleware/auth.middleware';
import {fetchTwitchUserFollowersCount} from "../utils/twitch-api";

const router = Router();

// Create new creator profile with donation parameters
router.post('/:name', verifyToken(), async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    console.log(req.params.name);
    const {
      minimumAlertAmount = DEFAULT_DONATION_MIN_ALERT_AMOUNT,
      minimumTTSAmount = DEFAULT_DONATION_MIN_TTS_AMOUNT,
      minimumSfxAmount = DEFAULT_DONATION_MIN_SFX_AMOUNT,
      voiceId,
      alertMuted,
      ttsMuted,
      sfxMuted,
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
    donationParameters.alertMuted = alertMuted;
    donationParameters.ttsMuted = ttsMuted;
    donationParameters.sfxMuted = sfxMuted;
    donationParameters.customBadWords = customBadWords;

    const creatorRepository = AppDataSource.getRepository(Creator);
    const donationParamsRepository =
      AppDataSource.getRepository(DonationParameters);
    const tokenRepository = AppDataSource.getRepository(CreatorToken);
    const networkRepository = AppDataSource.getRepository(CreatorNetwork);
    const referralRepository = AppDataSource.getRepository(Referral);

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

    //Create referral record if valid
    // const match = await referralRepository.findBy({
    //   referred: { id: savedCreator.id },
    // });

    // if (!match) {


      await fetchTwitchUserFollowersCount(name)

    const referrer = await creatorRepository.findBy({
      name: name
    });

    const referred = await creatorRepository.findBy({
      name: creator.name
    });

    const referral = new Referral();
      referral.credited = false;
      referral.referred = referrer[0];
      referral.referrer = referred[0];
      referral.reward = "Wow"


    await referralRepository.save(referral);

    // TODO: Remove token and network linked creator (redundant in response)
    res.status(201).json({
      creator: {
        ...savedCreator,
        donationParameters: savedDonationParameters,
        tokens: tokenEntities,
        networks: networkEntities,
      },
    });
  } catch (error) {
    console.error('Error creating creator profile:', error);
    res.status(500).json({ error: 'Failed to create creator profile' });
  }
});

router.patch(
  '/:name',
  verifyToken(),
  [param('name').isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const name = req.params.name;
      const creatorRepository = AppDataSource.getRepository(Creator);
      const donationParamsRepository =
        AppDataSource.getRepository(DonationParameters);
      const tokenRepository = AppDataSource.getRepository(CreatorToken);
      const networkRepository = AppDataSource.getRepository(CreatorNetwork);

      const creator = await creatorRepository.findOne({
        where: { name },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      if (creator.privyId !== req.user.id) {
        res
          .status(403)
          .json({ error: 'Forbidden: You can only edit your own profile' });
        return;
      }

      const {
        minimumAlertAmount,
        minimumTTSAmount,
        minimumSfxAmount,
        voiceId,
        alertMuted,
        ttsMuted,
        sfxMuted,
        tokens = [],
        networks = [],
        customBadWords,
        primaryAddress,
        ...creatorData
      } = req.body;

      // Update creator with provided fields if present
      if (Object.keys(creatorData).length > 0) {
        await creatorRepository.update({ id: creator.id }, creatorData);
      }

      // Update donation parameters if they exist and are provided
      if (
        minimumAlertAmount ||
        minimumTTSAmount ||
        minimumSfxAmount ||
        voiceId ||
        alertMuted ||
        ttsMuted ||
        sfxMuted ||
        customBadWords
      ) {
        const donationParams = await donationParamsRepository.findOne({
          where: { creator: { id: creator.id } },
        });

        if (donationParams) {
          await donationParamsRepository.update(
            { id: donationParams.id },
            {
              minimumAlertAmount,
              minimumTTSAmount,
              minimumSfxAmount,
              voiceId,
              alertMuted,
              ttsMuted,
              sfxMuted,
              customBadWords,
            },
          );
        } else {
          const newDonationParams = donationParamsRepository.create({
            creator,
            minimumAlertAmount,
            minimumTTSAmount,
            minimumSfxAmount,
            voiceId,
            alertMuted,
            ttsMuted,
            sfxMuted,
            customBadWords,
          });
          await donationParamsRepository.save(newDonationParams);
        }
      }

      // Handle tokens
      const existingTokens = await tokenRepository.find({
        where: { creator: { id: creator.id } },
      });

      // Remove tokens that are no longer in the params
      for (const existingToken of existingTokens) {
        if (!tokens.includes(existingToken.tokenSymbol)) {
          await tokenRepository.remove(existingToken);
        }
      }

      // Add new tokens
      for (const tokenSymbol of tokens) {
        const existingToken = existingTokens.find(
          (t) => t.tokenSymbol === tokenSymbol,
        );
        if (!existingToken) {
          const newToken = new CreatorToken();
          newToken.tokenSymbol = tokenSymbol;
          newToken.creator = creator;
          await tokenRepository.save(newToken);
        }
      }

      // Handle networks
      const existingNetworks = await networkRepository.find({
        where: { creator: { id: creator.id } },
      });

      // Remove networks that are no longer in the params
      for (const existingNetwork of existingNetworks) {
        if (!networks.includes(existingNetwork.chainName)) {
          await networkRepository.remove(existingNetwork);
        }
      }

      // Add new networks
      for (const chainName of networks) {
        const existingNetwork = existingNetworks.find(
          (n) => n.chainName === chainName,
        );
        if (!existingNetwork) {
          const newNetwork = new CreatorNetwork();
          newNetwork.chainName = chainName;
          newNetwork.creator = creator;
          await networkRepository.save(newNetwork);
        }
      }

      const updatedCreator = await creatorRepository.findOne({
        where: { name: req.body.name || name },
      });

      const updatedDonationParams = await donationParamsRepository.findOne({
        where: { creator: { id: creator.id } },
      });

      const updatedTokenEntities = await tokenRepository.find({
        where: { creator: { id: creator.id } },
      });

      const updatedNetworkEntities = await networkRepository.find({
        where: { creator: { id: creator.id } },
      });

      res.json({
        message: 'Creator profile updated successfully',
        creator: {
          ...updatedCreator,
          donationParameters: updatedDonationParams,
          tokens: updatedTokenEntities,
          networks: updatedNetworkEntities,
        },
      });
      return;
    } catch (error) {
      console.error('Error updating creator profile:', error);
      res.status(500).json({ error: 'Failed to update creator profile' });
      return;
    }
  },
);

export default router;
