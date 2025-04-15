import { Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import { join } from 'path';
import { mode } from '../utils/mode';
import { body, validationResult } from 'express-validator';
import { Readable } from 'stream';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = 'TX3LPaxmHKxFdv7VOQHJ';
const router = express.Router();

const validationRules = [body('text').isString().notEmpty()];

router.post('/', validationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { text } = req.body;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': `${ELEVENLABS_API_KEY}`,
        },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
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
});

export default router;
