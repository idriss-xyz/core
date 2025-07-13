import { Request, Response, Router } from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import s3Config from '../config/aws-s3';

const router = Router();

router.get('/:address', async (req: Request, res: Response) => {
  try {
    const address = req.params.address;

    if (!address) {
      res.status(400).json({ error: 'Invalid or missing address' });
      console.error('Invalid or missing address');
      return;
    }

    const s3Key = `${address.slice(-8)}`;
    const { s3, S3_BUCKET } = s3Config;

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
    });

    const response = await s3.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
      res.status(500).json({ error: 'Invalid S3 response body' });
      console.error('Invalid S3 response body');
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');

    response.Body.pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'Audio file not found' });
    console.error('Audio file not found');
    return;
  }
});

export default router;
