import { Router, Request, Response } from 'express';
import { AppDataSource, DonationEffect } from '@idriss-xyz/db';

const router = Router();

const donationEffectRepository = AppDataSource.getRepository(DonationEffect);

router.post('/', async (req: Request, res: Response) => {
  const { txHash, sfxMessage } = req.body;

  if (
    !txHash ||
    typeof txHash !== 'string' ||
    !sfxMessage ||
    typeof sfxMessage !== 'string'
  ) {
    res.status(400).json({ error: 'Invalid txHash or sfxMessage' });
    return;
  }

  try {
    // Create new donation effect
    const donationEffect = new DonationEffect();
    donationEffect.txHash = txHash.toLowerCase();
    donationEffect.sfxMessage = sfxMessage;

    // Save to database
    await donationEffectRepository.save(donationEffect);

    res.json({ message: 'Stored donation effect successfully' });
  } catch (error) {
    console.error('Error storing donation effect:', error);
    res.status(500).json({ error: 'Failed to store donation effect' });
  }
});

router.get('/:txHash', async (req: Request, res: Response) => {
  const { txHash } = req.params;

  if (!txHash || typeof txHash !== 'string') {
    res.status(400).json({ error: 'Invalid txHash parameter' });
    return;
  }

  try {
    // Find donation effect by txHash
    const donationEffect = await donationEffectRepository.findOne({
      where: { txHash: txHash.toLowerCase() },
    });

    if (!donationEffect) {
      res.status(404).json({ error: 'No sfxMessage found for this txHash' });
      return;
    }

    res.json({ sfxMessage: donationEffect.sfxMessage });
  } catch (error) {
    console.error('Error retrieving donation effect:', error);
    res.status(500).json({ error: 'Failed to retrieve donation effect' });
  }
});

export default router;
