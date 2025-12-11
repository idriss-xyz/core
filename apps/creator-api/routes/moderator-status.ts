import { Router, Request, Response } from 'express';

import { getModerationStatus } from '@idriss-xyz/utils/server';
import { verifyToken } from '../middleware/auth.middleware';
import { tightCors } from '../config/cors';
import { creatorAuthTokenService } from '../services/creator-auth-token.service';
import { AppDataSource, Creator } from '@idriss-xyz/db';

const router = Router();
router.get(
  '/:creatorName',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    try {
      const { creatorName } = req.params;
      const userId = req.user.id;

      // Get valid auth token for the creator
      const authToken = await creatorAuthTokenService.getValidAuthToken(userId);

      if (!authToken) {
        res.status(401).json({
          error: 'No valid Twitch auth token found for creator',
        });
        return;
      }

      const creatorRepo = AppDataSource.getRepository(Creator);
      const creator = await creatorRepo.findOne({
        where: { privyId: userId },
      });

      if (!creator?.twitchId) {
        res.status(500).json({
          error: 'No valid Twitch id found for creator',
        });
        return;
      }

      // Check moderation status
      const isModerator = await getModerationStatus(
        creator.twitchId,
        authToken,
      );

      if (isModerator === null) {
        res.status(500).json({
          error: 'Failed to check moderation status',
        });
        return;
      }

      res.json({ isModerator });
    } catch (error) {
      console.error('Error in moderator-status route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
