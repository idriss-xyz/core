import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { CreatorProfileView } from '../db/views/creator-profile.view';
import { AppDataSource } from '../db/database';
import { Creator, DonationParameters } from '../db/entities';
import { Hex } from 'viem';

const router = Router();

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
      const repository = AppDataSource.getRepository(CreatorProfileView);
      const profile = await repository.findOne({ where: { name } });

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      res.json(profile);
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
      const repository = AppDataSource.getRepository(CreatorProfileView);
      const profile = await repository.findOne({ where: { id } });

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      res.json(profile);
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
      const repository = AppDataSource.getRepository(CreatorProfileView);
      const profile = await repository.findOne({ where: { address } });

      if (!profile) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      res.json(profile);
    } catch (error) {
      console.error('Error fetching creator profile by address:', error);
      res.status(500).json({ error: 'Failed to fetch creator profile' });
    }
  },
);

// Create new creator profile with donation parameters
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      minimumAlertAmount = 1,
      minimumTTSAmount = 5,
      minimumSfxAmount = 10,
      voiceId,
      voiceMuted,
      ...creatorData
    } = req.body;

    const donationParameters = new DonationParameters();
    donationParameters.minimumAlertAmount = minimumAlertAmount;
    donationParameters.minimumTTSAmount = minimumTTSAmount;
    donationParameters.minimumSfxAmount = minimumSfxAmount;
    donationParameters.voiceId = voiceId;
    donationParameters.voiceMuted = voiceMuted;

    const creatorRepository = AppDataSource.getRepository(Creator);
    const donationParamsRepository =
      AppDataSource.getRepository(DonationParameters);

    const creator = new Creator();
    creator.address = creatorData.address as Hex;
    creator.primaryAddress =
      (creatorData.primaryAddress as Hex) ?? (creatorData.address as Hex);
    creator.name = creatorData.name as Hex;
    creator.profilePictureUrl = creatorData.profilePictureUrl;
    creator.donationUrl = creatorData.donationUrl;
    creator.obsUrl = creatorData.obsUrl;

    // Create and save new creator
    const savedCreator = await creatorRepository.save(creator);

    donationParameters.creator = savedCreator;

    // Create and save donation parameters with creator reference
    const savedDonationParameters =
      await donationParamsRepository.save(donationParameters);

    res.status(201).json({
      creator: savedCreator,
      donationParameters: savedDonationParameters,
    });
  } catch (error) {
    console.error('Error creating creator profile:', error);
    res.status(500).json({ error: 'Failed to create creator profile' });
  }
});

router.patch(
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
      const creatorRepository = AppDataSource.getRepository(Creator);
      const donationParamsRepository =
        AppDataSource.getRepository(DonationParameters);

      const creator = await creatorRepository.findOne({
        where: { name },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      const {
        minimumAlertAmount,
        minimumTTSAmount,
        minimumSfxAmount,
        voiceId,
        voiceMuted,
        ...creatorData
      } = req.body;

      // Update creator with provided fields
      await creatorRepository.update({ id: creator.id }, creatorData);
      // Update donation parameters if they exist and are provided
      if (
        minimumAlertAmount ||
        minimumTTSAmount ||
        minimumSfxAmount ||
        voiceId ||
        voiceMuted
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
              voiceMuted,
            },
          );
        }
        // If donation parameters don't exist, create a new one
        else {
          const newDonationParams = donationParamsRepository.create({
            creator,
            minimumAlertAmount,
            minimumTTSAmount,
            minimumSfxAmount,
            voiceId,
            voiceMuted,
          });
          await donationParamsRepository.save(newDonationParams);
        }
      }

      const updatedCreator = await creatorRepository.findOne({
        where: { name: req.body.name || name },
      });

      const updatedDonationParams = await donationParamsRepository.findOne({
        where: { creator: { id: creator.id } },
      });

      res.json({
        message: 'Creator profile updated successfully',
        creator: updatedCreator,
        donationParameters: updatedDonationParams,
      });
    } catch (error) {
      console.error('Error updating creator profile:', error);
      res.status(500).json({ error: 'Failed to update creator profile' });
    }
  },
);

export default router;
