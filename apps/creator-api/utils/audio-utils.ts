import { Response, Request } from 'express';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { S3_CLIENT, S3_BUCKET } from '../config/aws-config';

export interface FileUploadRequest extends Request {
  file: Express.Multer.File;
}

export async function handleUpload(
  req: FileUploadRequest,
  res: Response,
  privyId: string,
) {
  if (req.file.mimetype !== 'audio/mpeg') {
    console.error('Only MP3 files are allowed');
    res.status(400).send('Only MP3 files are allowed');
    return;
  }

  const { fileTypeFromBuffer } = await import('file-type');
  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || type.mime !== 'audio/mpeg') {
    console.error('Invalid file format: not a valid MP3');
    res.status(400).send('Invalid file format: not a valid MP3');
    return;
  }

  const { parseBuffer } = await import('music-metadata');
  const metadata = await parseBuffer(req.file.buffer, {
    mimeType: 'audio/mpeg',
  });
  const duration = metadata.format.duration;
  if (!duration) {
    console.error('Could not determine MP3 duration. File may be corrupted');
    res
      .status(400)
      .send('Could not determine MP3 duration. File may be corrupted');
    return;
  }

  if (duration > 5) {
    console.error(
      `MP3 too long: ${duration.toFixed(2)} seconds. Max allowed is 5s`,
    );
    res
      .status(400)
      .send(`MP3 too long: ${duration.toFixed(2)} seconds. Max allowed is 5s`);
    return;
  }

  const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const s3Key = privyId;

  await S3_CLIENT.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: 'audio/mpeg',
      Metadata: {
        sanitizedOriginalName: encodeURIComponent(sanitizedName),
      },
    }),
  );

  res.status(200).send('File uploaded successfully.');
  return;
}

export async function streamAudioFromS3(
  privyId: string,
  res: Response,
): Promise<void> {
  try {
    const s3Key = privyId;

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
    });

    const response = await S3_CLIENT.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
      console.error('Invalid S3 response body');
      res.status(500).json({ error: 'Invalid S3 response body' });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    response.Body.pipe(res);
  } catch (err) {
    // The AWS SDK v3 client throws an error with the name 'NoSuchKey'
    if (err instanceof Error && err.name === 'NoSuchKey') {
      res.status(404).json({ error: 'Audio file not found' });
    } else {
      console.error('Error fetching audio file:', err);
      res.status(500).json({ error: 'Failed to fetch audio file' });
    }
  }
}
