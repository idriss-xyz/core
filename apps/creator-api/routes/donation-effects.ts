import { Router, Request, Response } from 'express';

const router = Router();

const donationEffectsMap = new Map<string, string>();

router.post('/', (req: Request, res: Response) => {
  const { txHash, sfxMessage } = req.body;

  if (!txHash || typeof txHash !== 'string' || !sfxMessage || typeof sfxMessage !== 'string') {
    res.status(400).json({ error: 'Invalid txHash or sfxMessage' });
  }

  donationEffectsMap.set(txHash.toLowerCase(), sfxMessage);
  res.json({ message: 'Stored donation effect successfully' });

});

router.get('/:txHash', (req: Request, res: Response) => {
  const { txHash } = req.params;

  if (!txHash || typeof txHash !== 'string') {
    res.status(400).json({ error: 'Invalid txHash parameter' });
  }

  const sfxMessage = donationEffectsMap.get(txHash.toLowerCase());
  if (!sfxMessage) {
    res.status(404).json({ error: 'No sfxMessage found for this txHash' });
  }

  res.json({ sfxMessage });
});

export default router;
