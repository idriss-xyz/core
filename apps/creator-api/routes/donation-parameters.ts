import { Router, Request, Response } from 'express';
import { AppDataSource, DonationParameters } from '@idriss-xyz/db';
import { body, validationResult } from 'express-validator';

const router = Router();

const validationRules = [
  body('minimumAlertAmount').isString().notEmpty(),
  body('minimumTTSAmount').isString().notEmpty(),
  body('minimumSfxAmount').isString().notEmpty(),
  body('alertEnabled').isBoolean().notEmpty(),
  body('ttsEnabled').isBoolean().notEmpty(),
  body('sfxEnabled').isBoolean().notEmpty(),
  body('customBadWords').optional().isArray(),
  body('tokenEnabled').isBoolean().notEmpty(),
  body('collectibleEnabled').isBoolean().notEmpty(),
];

router.post('/', validationRules, async (req: Request, res: Response) => {
  const donationParamsRepository =
    AppDataSource.getRepository(DonationParameters);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const {
    minimumAlertAmount,
    minimumTTSAmount,
    minimumSfxAmount,
    alertEnabled,
    ttsEnabled,
    sfxEnabled,
    customBadWords = [],
    tokenEnabled,
    collectibleEnabled,
  } = req.body;

  try {
    const savedParams = await donationParamsRepository.save({
      minimumAlertAmount,
      minimumTTSAmount,
      minimumSfxAmount,
      alertEnabled,
      ttsEnabled,
      sfxEnabled,
      customBadWords,
      tokenEnabled,
      collectibleEnabled,
      creator: {
        id: req.body.creatorId,
      },
    });
    res.status(201).json(savedParams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save donation parameters' });
  }
});

export default router;
