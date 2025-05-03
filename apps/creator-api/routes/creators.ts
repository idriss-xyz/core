import { body, validationResult, param } from 'express-validator';
import { Router, Request, Response } from 'express';
import { Hex } from 'viem';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities/creator.entity';

const router = Router();

const newCreatorValidationRules = [
  body('address').isString().notEmpty(),
  body('primaryAddress').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('profilePictureUrl').optional().isString(),
  body('donationUrl').optional().isString(),
  body('obsUrl').optional().isString(),
];

// Get creator by name
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
      const creatorRepository = AppDataSource.getRepository(Creator);
      const creator = await creatorRepository.findOne({
        where: { name: req.params.name },
      });

      if (!creator) {
        res.status(404).json({ error: 'Creator not found' });
        return;
      }

      res.json(creator);
    } catch (error) {
      console.error('Error fetching creator by name:', error);
      res.status(500).json({ error: 'Failed to fetch creator' });
    }
  },
);


// Create a new creator profile
router.post(
  '/',
  newCreatorValidationRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const creatorRepository = AppDataSource.getRepository(Creator);

      // Check if creator with this address already exists
      const existingCreator = await creatorRepository.findOne({
        where: { address: req.body.address as Hex },
      });

      if (existingCreator) {
        res
          .status(409)
          .json({ error: 'Creator with this address already exists' });
        return;
      }

      const creator = new Creator();
      creator.address = req.body.address as Hex;
      creator.primaryAddress = req.body.primaryAddress as Hex;
      creator.name = req.body.name as Hex;
      creator.profilePictureUrl = req.body.profilePictureUrl;
      creator.donationUrl = req.body.donationUrl;
      creator.obsUrl = req.body.obsUrl;

      const savedCreator = await creatorRepository.save(creator);

      res.status(201).json(savedCreator);
    } catch (error) {
      console.error('Error creating creator profile:', error);
      res.status(500).json({ error: 'Failed to create creator profile' });
    }
  },
);

const editCreatorValidationRules = [
  param('id').isInt().toInt(),
  body('primaryAddress').optional().isString(),
  body('name').optional().isString(),
  body('profilePictureUrl').optional().isString(),
  body('donationUrl').optional().isString(),
  body('obsUrl').optional().isString(),
];

// Update creator profile by id
router.put(
  '/:id',
  editCreatorValidationRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const id = parseInt(req.params.id);
      const creatorRepository = AppDataSource.getRepository(Creator);

      // Find the creator
      const creator = await creatorRepository.findOne({ where: { id } });

      if (!creator) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      // Update fields if provided
      if (req.body.primaryAddress) {
        creator.primaryAddress = req.body.primaryAddress as Hex;
      }

      if (req.body.name) {
        creator.name = req.body.name as Hex;
      }

      if (req.body.profilePictureUrl !== undefined) {
        creator.profilePictureUrl = req.body.profilePictureUrl;
      }

      if (req.body.donationUrl !== undefined) {
        creator.donationUrl = req.body.donationUrl;
      }

      if (req.body.obsUrl !== undefined) {
        creator.obsUrl = req.body.obsUrl;
      }

      // Save updated creator to db
      const updatedCreator = await creatorRepository.save(creator);

      res.json(updatedCreator);
    } catch (error) {
      console.error('Error updating creator profile:', error);
      res.status(500).json({ error: 'Failed to update creator profile' });
    }
  },
);

export default router;
