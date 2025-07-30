import { Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, param, validationResult } from 'express-validator';
import { Readable } from 'stream';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_DEFAULT_VOICE_ID = 'TX3LPaxmHKxFdv7VOQHJ';
const MAX_REQUESTS_PER_MINUTE = 3;
const router = express.Router();

const validationRules = [
  body('text').isString().notEmpty(),
  param('name').isString().optional(),
];

const requestLimitation = rateLimit({
  windowMs: 60 * 1000,
  limit: MAX_REQUESTS_PER_MINUTE,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/:voiceId',
  requestLimitation,
  validationRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const { text, voiceId } = req.body;
      const trimmedText = text.trim();
      const finalText =
        trimmedText.length > 70 ? trimmedText.slice(0, 70) : trimmedText;

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId ?? ELEVENLABS_DEFAULT_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': `${ELEVENLABS_API_KEY}`,
          },
          body: JSON.stringify({
            text: finalText,
            model_id: 'eleven_multilingual_v2',
          }),
        },
      );

      if (!response.body) {
        res.status(500).json({ error: 'Failed to request text to speech' });
        return;
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      const nodeStream = Readable.fromWeb(response.body as any);
      nodeStream.pipe(res);
    } catch (error) {
      console.error('Text to speech error: ', error);
      res.status(500).json({ error: 'Failed to request text to speech' });
    }
  },
);

export default router;
