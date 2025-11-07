import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { creatorProfileService } from '../services/creator-profile.service';
import {
  Creator,
  DonationParameters,
  CreatorToken,
  CreatorNetwork,
  AppDataSource,
} from '@idriss-xyz/db';
import { Hex } from 'viem';

import {
  MAIN_LANDING_LINK,
  CREATOR_CHAIN,
  CHAIN_ID_TO_TOKENS,
  TEST_TOKEN_DONATION,
  TEST_NFT_DONATION,
} from '@idriss-xyz/constants';

import { tightCors } from '../config/cors';
import { verifyToken } from '../middleware/auth.middleware';
import { streamAudioFromS3 } from '../utils/audio-utils';
import type { StoredDonationData } from '@idriss-xyz/constants';

const router = Router();

router.get(
  '/me',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const creatorRepository = AppDataSource.getRepository(Creator);

      const creator = await creatorRepository.findOne({
        where: { privyId: req.user.id },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      const fullProfile = await creatorProfileService.getProfileById(
        creator.id,
      );

      if (!fullProfile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      res.json(fullProfile);
    } catch (error) {
      console.error('Error fetching authenticated creator profile:', error);
      res.status(500).json({ error: 'Failed to fetch creator profile' });
    }
  },
);

router.delete(
  '/me',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const creatorRepository = AppDataSource.getRepository(Creator);
      const creator = await creatorRepository.findOne({
        where: { privyId: req.user.id },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator not found' });
        return;
      }

      await creatorRepository.remove(creator);

      res.status(200).json({ message: 'Account deleted successfully' });
      return;
    } catch (error) {
      console.error('Error deleting creator account:', error);
      res.status(500).json({ error: 'Failed to delete creator account' });
      return;
    }
  },
);

// Get creator profile by name
router.get(
  '/:name',
  [param('name').isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const name = req.params.name;
      const profile = await creatorProfileService.getProfileByName(name);

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, receiveEmails, obsUrl, goalUrl, ...publicProfile } =
        profile;
      res.json(publicProfile);
    } catch (error) {
      console.error('Error fetching creator profile by name:', error);
      res.status(500).json({ error: 'Failed to fetch creator profile' });
    }
  },
);

// Get creator profile by ID
router.get(
  '/id/:id',
  [param('id').isInt().toInt()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const id = parseInt(req.params.id);
      const profile = await creatorProfileService.getProfileById(id);

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, receiveEmails, obsUrl, goalUrl, ...publicProfile } =
        profile;
      res.json(publicProfile);
    } catch (error) {
      console.error('Error fetching creator profile by ID:', error);
      res.status(500).json({ error: 'Failed to fetch creator profile' });
    }
  },
);

// Get creator profile by address
router.get(
  '/address/:address',
  [param('address').isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const address = req.params.address;
      const profile = await creatorProfileService.getProfileByAddress(address);

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, receiveEmails, obsUrl, goalUrl, ...publicProfile } =
        profile;
      res.json(publicProfile);
    } catch (error) {
      console.error('Error fetching creator profile by address:', error);
      res.status(500).json({ error: 'Failed to fetch creator profile' });
    }
  },
);

router.get(
  '/alert-overlay/:slug',
  [param('slug').isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const slug = req.params.slug;
      const creatorRepo = AppDataSource.getRepository(Creator);
      const creator = await creatorRepo.findOne({
        where: {
          obsUrl: `${MAIN_LANDING_LINK}/alert-overlay/${slug}`,
        },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator not found' });
        return;
      }

      const profile = await creatorProfileService.getProfileByAddress(
        creator?.address,
      );

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, obsUrl, goalUrl, ...publicProfile } = profile;
      res.json(publicProfile);
    } catch (error) {
      console.error('Error fetching creator profile by address:', error);
      res.status(500).json({ error: 'Failed to fetch creator profile' });
    }
  },
);

function buildTestDonationPayload(donation: StoredDonationData) {
  const base = {
    type: 'test' as const,
    donor: donation.fromUser.displayName ?? 'anon',
    message: donation.comment ?? '',
    sfxText: null,
    avatarUrl: donation.fromUser.avatarUrl,
    txnHash: donation.transactionHash,
  };

  if (donation.kind === 'token') {
    return {
      ...base,
      amount: donation.tradeValue ?? 0,
      token: {
        amount: donation.amountRaw,
        details: {
          symbol: donation.token.symbol,
          name: donation.token.name ?? donation.token.symbol,
          logo: donation.token.imageUrl,
          decimals: donation.token.decimals,
          address: donation.token.address,
        },
      },
    };
  }

  // nft
  const nftImage =
    donation.imgPreferred ||
    donation.imgMedium ||
    donation.imgSmall ||
    donation.imgLarge;

  return {
    ...base,
    amount: donation.quantity,
    token: {
      amount: donation.quantity,
      details: {
        id: String(donation.tokenId),
        name: donation.name,
        logo: nftImage,
        collectionName: donation.collectionShortName || donation.collectionSlug,
      },
    },
  };
}

router.post(
  '/test-alert',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const creatorRepository = AppDataSource.getRepository(Creator);
      const creator = await creatorRepository.findOne({
        where: { privyId: req.user.id },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator not found' });
        return;
      }

      const { kind = 'token', donation } = req.body ?? {};

      const payload = donation
        ? buildTestDonationPayload(donation as StoredDonationData)
        : kind === 'nft'
          ? TEST_NFT_DONATION
          : TEST_TOKEN_DONATION;

      const io = req.app.get('io');
      const overlayWS = io.of('/overlay');
      const userId = creator.privyId.toLowerCase();

      overlayWS.to(userId).emit('testDonation', payload);

      res.status(200).json({ message: 'Test alert sent.' });
      return;
    } catch (error) {
      console.error('Error sending test alert:', error);
      res.status(500).json({ error: 'Failed to send test alert' });
      return;
    }
  },
);

// Create new creator profile with donation parameters
router.post(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const { savedCreator, savedDonationParameters } =
        await creatorProfileService.createCreatorProfile(req);

      res.status(201).json({
        creator: {
          ...savedCreator,
          donationParameters: savedDonationParameters,
        },
      });
    } catch (error) {
      console.error('Error creating creator profile:', error);
      res.status(500).json({ error: 'Failed to create creator profile' });
    }
  },
);

router.patch(
  '/:name',
  tightCors,
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
        alertSound,
        alertEnabled,
        ttsEnabled,
        sfxEnabled,
        tokenEnabled,
        collectibleEnabled,
        tokens,
        networks,
        customBadWords,
        primaryAddress,
        ...creatorData
      } = req.body;

      // Update creator done_setup
      if (creator.doneSetup === false) {
        await creatorRepository.update({ id: creator.id }, { doneSetup: true });
      }

      // Update creator with provided fields if present
      if (Object.keys(creatorData).length > 0) {
        await creatorRepository.update({ id: creator.id }, creatorData);
      }

      // Update donation parameters if they exist and are provided
      if (
        minimumAlertAmount !== undefined ||
        minimumTTSAmount !== undefined ||
        minimumSfxAmount !== undefined ||
        voiceId !== undefined ||
        alertSound !== undefined ||
        alertEnabled !== undefined ||
        ttsEnabled !== undefined ||
        sfxEnabled !== undefined ||
        customBadWords !== undefined ||
        tokenEnabled !== undefined ||
        collectibleEnabled !== undefined
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
              alertSound,
              alertEnabled,
              ttsEnabled,
              sfxEnabled,
              customBadWords,
              tokenEnabled,
              collectibleEnabled,
            },
          );
        } else {
          const newDonationParams = donationParamsRepository.create({
            creator,
            minimumAlertAmount,
            minimumTTSAmount,
            minimumSfxAmount,
            voiceId,
            alertSound,
            alertEnabled,
            ttsEnabled,
            sfxEnabled,
            customBadWords,
            tokenEnabled,
            collectibleEnabled,
          });
          await donationParamsRepository.save(newDonationParams);
        }
      }

      // Handle tokens
      if (tokens !== undefined && tokens.length > 0) {
        const networksToCheck =
          networks !== undefined && networks.length > 0
            ? networks
            : (
                await AppDataSource.getRepository(CreatorNetwork).find({
                  where: { creator: { id: creator.id } },
                })
              ).map((n) => n.chainName);

        const networkIds = networksToCheck
          .map(
            (shortName: string) =>
              Object.values(CREATOR_CHAIN).find(
                (c) => c.shortName === shortName,
              )?.id,
          )
          .filter((id: number | undefined): id is number => id !== undefined);

        const allowedTokenSymbols = [
          ...new Set(
            networkIds.flatMap(
              (id: number) =>
                CHAIN_ID_TO_TOKENS[id]?.map((t) => t.symbol) ?? [],
            ),
          ),
        ];

        const invalidTokens = tokens.filter(
          (symbol: string) => !allowedTokenSymbols.includes(symbol),
        );
        if (invalidTokens.length) {
          res.status(400).json({
            error: `Invalid token(s) for selected networks: ${invalidTokens.join(
              ', ',
            )}`,
          });
          return;
        }

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
      }

      // Handle networks
      if (networks !== undefined && networks.length > 0) {
        const allowedNetworks = Object.values(CREATOR_CHAIN).map(
          (c) => c.shortName,
        );
        const invalidNetworks = networks.filter(
          (n: string) => !allowedNetworks.includes(n),
        );
        if (invalidNetworks.length) {
          res.status(400).json({
            error: `Invalid network(s): ${invalidNetworks.join(', ')}`,
          });
          return;
        }

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

      try {
        const io = req.app.get('io');
        const overlayWS = io.of('/overlay');
        const userId = creator.privyId.toLowerCase();

        const { email, joinedAt, ...updatedPublicProfile } = updatedCreator!;

        overlayWS.to(userId).emit('creatorConfigUpdated', {
          creator: updatedPublicProfile,
          donationParameters: updatedDonationParams,
          tokens: updatedTokenEntities,
          networks: updatedNetworkEntities,
        });
      } catch {
        console.log('Streamer not online, will load on stream start.');
      }

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

// Get creator audio by name
router.get(
  '/audio/:name',
  [param('name').isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const name = req.params.name;
      const creatorRepository = AppDataSource.getRepository(Creator);
      const creator = await creatorRepository.findOne({
        where: { name },
      });

      if (!creator || !creator.privyId) {
        res
          .status(404)
          .json({ error: 'Creator profile not found or misconfigured' });
        return;
      }

      await streamAudioFromS3(creator.privyId, res);
    } catch (error) {
      console.error('Error processing audio request by name:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to process request' });
      }
    }
  },
);

// Get creator audio by address
router.get(
  '/audio/address/:address',
  [param('address').isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const address = req.params.address as Hex;
      const creatorRepository = AppDataSource.getRepository(Creator);
      const creator = await creatorRepository.findOne({
        where: { address },
      });

      if (!creator || !creator.privyId) {
        res
          .status(404)
          .json({ error: 'Creator profile not found or misconfigured' });
        return;
      }

      await streamAudioFromS3(creator.privyId, res);
    } catch (error) {
      console.error('Error processing audio request by address:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to process request' });
      }
    }
  },
);

router.post('/broadcast-force-refresh', async (req: Request, res: Response) => {
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.SECRET_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const io = req.app.get('io');
    const overlayWS = io.of('/overlay');

    overlayWS.emit('forceRefresh');

    res
      .status(200)
      .json({ message: 'Force refresh signal sent to all live overlays.' });
    return;
  } catch (error) {
    console.error('Error broadcasting force refresh signal:', error);
    res.status(500).json({ error: 'Failed to broadcast refresh signal.' });
    return;
  }
});

router.get('/list/all', async (req: Request, res: Response) => {
  const { secret } = req.query;
  if (secret !== process.env.SECRET_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const creatorRepository = AppDataSource.getRepository(Creator);
    const creators = await creatorRepository.find({
      order: {
        joinedAt: 'ASC',
      },
    });

    const creatorList = creators.map((creator) => ({
      displayName: creator.displayName,
      joinedAt: creator.joinedAt,
      doneSetup: creator.doneSetup,
      donationUrl: creator.donationUrl,
      twitchUrl: `https://twitch.tv/${creator.displayName}`,
      donor: creator.isDonor,
    }));

    res.json(creatorList);
  } catch (error) {
    console.error('Error fetching all creators:', error);
    res.status(500).json({ error: 'Failed to fetch all creators' });
  }
});

export default router;
