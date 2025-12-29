import { Router, Request, Response } from 'express';
import { batchFetchTwitchStreamStatus } from '@idriss-xyz/utils/server';

const router = Router();

router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { names } = await req.body;

    if (!Array.isArray(names)) {
      res.status(400).json('Names must be an array');
    }

    const statuses = await batchFetchTwitchStreamStatus(names);
    const liveMap: Record<string, boolean> = {};

    for (const [name, status] of Object.entries(statuses)) {
      liveMap[name] = status.isLive;
    }

    res.status(200).json({
      liveStatuses: liveMap,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching twitch stream status',
      message: error,
    });
  }
});

export default router;
