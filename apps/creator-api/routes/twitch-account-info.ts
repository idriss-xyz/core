import {
  fetchTwitchStreamStatus,
  fetchTwitchUserInfo,
} from '@idriss-xyz/utils/server';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;

    if (!name) {
      res.status(400).json('Missing user ID');
      return;
    }

    const [userInfo, streamInfo] = await Promise.all([
      fetchTwitchUserInfo(name),
      fetchTwitchStreamStatus(name),
    ]);

    if (!userInfo) {
      res.status(404).json('User not found');
      return;
    }

    res.status(200).json({
      ...userInfo,
      streamStatus: streamInfo.isLive,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching twitch user info',
      message: error,
    });
  }
});

export default router;
