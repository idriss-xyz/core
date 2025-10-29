import { Router, Request, Response } from 'express';

import { tightCors } from '../config/cors';
import { verifyToken } from '../middleware/auth.middleware';
import { donationGoalService } from '../services/donation-goal.service';
import { Creator, DonationGoal, AppDataSource } from '@idriss-xyz/db';

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

    // Parse each donation goal and add topDonor field
    const parsedDonationGoals = donationGoals.map((donationGoal) => ({
      ...donationGoal,
      topDonor: {
        name: donationGoal.topDonorName,
        amount: donationGoal.topDonorAmount,
      },
    }));

    res.status(200).json(parsedDonationGoals);
  },
);

// Get active donation goal by creator name
router.get(
  '/:creatorName/active',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    const { creatorName } = req.params;
    const activeGoal =
      await donationGoalService.getActiveDonationGoalByCreatorName(creatorName);

    if (!activeGoal) {
      res.status(404).json({ error: 'No active donation goal found' });
      return;
    }

    // Parse the active goal and add topDonor field
    const parsedActiveGoal = {
      ...activeGoal,
      topDonor: {
        name: activeGoal.topDonorName,
        amount: activeGoal.topDonorAmount,
      },
    };

    res.status(200).json(parsedActiveGoal);
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
    const { name, targetAmount, startDate, endDate, active = false } = req.body;
    const donationGoal = new DonationGoal();
    donationGoal.name = name;
    donationGoal.targetAmount = targetAmount;
    donationGoal.startDate = startDate;
    donationGoal.endDate = endDate;
    donationGoal.active = active;
    donationGoal.creator = creator;
    try {
      const createdDonationGoal =
        await donationGoalService.createDonationGoal(donationGoal);
      res.status(201).json(createdDonationGoal);
    } catch (error) {
      console.error('Error creating donation goal:', error);
      res.status(500).json({ error: 'Failed to create donation goal' });
    }
  },
);

// Activate a donation goal
router.patch(
  '/:goalId/activate',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const goalId = parseInt(req.params.goalId);
      const activatedGoal = await donationGoalService.activateGoal(goalId);
      res.status(200).json(activatedGoal);
    } catch (error) {
      console.error('Error activating donation goal:', error);
      res.status(500).json({ error: 'Failed to activate donation goal' });
    }
  },
);

// Deactivate a donation goal
router.patch(
  '/:goalId/deactivate',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const goalId = parseInt(req.params.goalId);
      const deactivatedGoal = await donationGoalService.deactivateGoal(goalId);
      res.status(200).json(deactivatedGoal);
    } catch (error) {
      console.error('Error deactivating donation goal:', error);
      res.status(500).json({ error: 'Failed to deactivate donation goal' });
    }
  },
);

// Delete a donation goal
router.delete(
  '/:goalId',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const goalId = parseInt(req.params.goalId);
      const deletedGoal = await donationGoalService.deleteDonationGoal(goalId);
      res.status(200).json(deletedGoal);
    } catch (error) {
      console.error('Error deleting donation goal:', error);
      res.status(500).json({ error: 'Failed to delete donation goal' });
    }
  },
);

export default router;
