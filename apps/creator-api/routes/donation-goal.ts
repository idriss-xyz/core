import { Router, Request, Response } from 'express';

import { tightCors } from '../config/cors';
import { verifyToken } from '../db/middleware/auth.middleware';
import { donationGoalService } from '../services/donation-goal.service';
import { Creator, DonationGoal } from '../db/entities';
import { AppDataSource } from '../db/database';

const router = Router();

// Get donation goals by creator name
router.get(
  '/:creatorName',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    const { creatorName } = req.params;
    const donationGoals =
      await donationGoalService.getDonationGoalsByCreatorName(creatorName);
    res.status(200).json(donationGoals);
  },
);

// Create new donation goal for creator
router.post(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const creatorRepository = AppDataSource.getRepository(Creator);
    const creator = await creatorRepository.findOne({
      where: { privyId: req.user.id },
    });

    if (!creator) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }
    const { name, targetAmount, startDate, endDate } = req.body;
    const donationGoal = new DonationGoal();
    donationGoal.name = name;
    donationGoal.targetAmount = targetAmount;
    donationGoal.startDate = startDate;
    donationGoal.endDate = endDate;
    donationGoal.creator = creator;
    try {
      const createdDonationGoal =
        await donationGoalService.createDonationGoal(donationGoal);
      res.status(201).json(createdDonationGoal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create donation goal' });
    }
  },
);

export default router;
