import { Router, Request, Response } from 'express';
import { batchFetchTwitchStreamStatus } from '@idriss-xyz/utils/server';

const router = Router();

type CacheEntry = {
  data: Record<string, boolean>;
  expiresAt: number;
};

const CACHE_TTL = 60_000; // 1 minute
const cache = new Map<string, CacheEntry>();

router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { names } = req.body;

    if (!Array.isArray(names)) {
      res.status(400).json('Names must be an array');
    }

    const sortedNames = [...names].sort();
    const cacheKey = sortedNames.join(',');

    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      res.status(200).json({
        liveStatuses: cached.data,
        cached: true,
      });
    }

    const statuses = await batchFetchTwitchStreamStatus(sortedNames);

    const liveMap: Record<string, boolean> = {};
    for (const [name, status] of Object.entries(statuses)) {
      liveMap[name] = status.isLive;
    }

    cache.set(cacheKey, {
      data: liveMap,
      expiresAt: now + CACHE_TTL,
    });

    res.status(200).json({
      liveStatuses: liveMap,
      cached: false,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching twitch stream status',
      message: error,
    });
  }
});

export default router;
