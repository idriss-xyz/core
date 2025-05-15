import { Router, Request, Response } from 'express';
import { DonationParameters } from '../db/entities/donation-parameters.entity';
import { AppDataSource } from '../db/database';
import { body, validationResult } from 'express-validator';

const router = Router();

const validationRules = [
  body('minimumAlertAmount').isString().notEmpty(),
  body('minimumTTSAmount').isString().notEmpty(),
  body('minimumSfxAmount').isString().notEmpty(),
];

router.post('/', validationRules, async (req: Request, res: Response) => {
  const donationParamsRepository =
    AppDataSource.getRepository(DonationParameters);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { minimumAlertAmount, minimumTTSAmount, minimumSfxAmount } = req.body;

  try {
    const savedParams = await donationParamsRepository.save({
      minimumAlertAmount,
      minimumTTSAmount,
      minimumSfxAmount,
      // TODO: Check this
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
