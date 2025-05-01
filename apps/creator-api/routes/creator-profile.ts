import { Request, Response } from 'express';
import express from 'express';
import { param, validationResult } from 'express-validator';
import { CreatorProfileView } from '../db/views/creator-profile.view';
import { AppDataSource } from '../db/database';

const router = express.Router();

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

export default router;
