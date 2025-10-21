import { Router, Request, Response } from 'express';
import { AppDataSource, User } from '@idriss-xyz/db';
import { refetchEnsAvatar } from '../utils/refetch-ens-avatar';
import { Hex } from 'viem';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Missing or invalid address' });
      return;
    }
    const userRepo = AppDataSource.getRepository(User);
    const userAddress = address.toLowerCase() as Hex;
    const user = await userRepo.findOne({
      where: { address: userAddress },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const newAvatarUrl = await refetchEnsAvatar(user, userRepo);
    res.json({
      message: 'User metadata refreshed',
      displayName: user.displayName,
      displayNameSource: user.displayNameSource,
      avatarUrl: newAvatarUrl,
      avatarSource: user.avatarSource,
    });
  } catch (error) {
    console.error('Error refreshing user metadata', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
