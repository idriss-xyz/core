import { Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { Readable } from 'stream';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const MAX_REQUESTS_PER_MINUTE = 3;
const router = express.Router();

const validationRules = [body('text').isString().notEmpty()];

const requestLimitation = rateLimit({
  windowMs: 60 * 1000,
  limit: MAX_REQUESTS_PER_MINUTE,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  requestLimitation,
  validationRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const { text } = req.body;
      const finalText = text.length > 30 ? text.slice(0, 30) : text; // TODO: Check limit

      console.log("Getting sfx for text: ", finalText);

      const response = await fetch(
        `https://api.elevenlabs.io/v1/sound-generation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': `${ELEVENLABS_API_KEY}`,
          },
          body: JSON.stringify({
            text: finalText,
            duration_seconds: 4,
          }),
        },
      );

      if (!response.body) {
        res.status(500).json({ error: 'Failed to request text to sfx' });
        return;
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      const nodeStream = Readable.fromWeb(response.body as any);
      nodeStream.pipe(res);
    } catch (error) {
      console.error('Text to sfx error: ', error);
      res.status(500).json({ error: 'Failed to request text to sfx' });
    }
  },
);

export default router;
