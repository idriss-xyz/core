import express from 'express';
import { getSubscriptionsDetails } from '../services/subscriptionManager';
import { throwInternalError } from '../middleware/error.middleware';

const router = express.Router();

router.get('/:subscriberId', async (req, res) => {
  const { subscriberId } = req.params || {};
  try {
    const details = await getSubscriptionsDetails(subscriberId);
    res.status(200).json({ subscriberId, details });
  } catch (error) {
    throwInternalError(res, 'Error fetching subscriptions', error);
  }
});

export default router;
