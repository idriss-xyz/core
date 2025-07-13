import { Request, Response, Router } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import { parseBuffer } from 'music-metadata';
import upload from '../config/multer';
import s3Config from '../config/aws-s3';
import { MulterError } from 'multer';

const router = Router();

interface FileUploadRequest extends Request {
  file: Express.Multer.File;
}

router.post('/', (req: Request, res: Response): void => {
  upload.single('file')(req, res, async (err: any) => {
    try {
      if (err) {
        if ((err as MulterError).code === 'LIMIT_FILE_SIZE') {
          console.error('File too large. Max allowed is 300KB');
          return res.status(400).send('File too large. Max allowed is 300KB');
        }
        console.error('Multer error:', err);
        return res.status(400).send('File upload failed');
      }

      if (!req.file) {
        console.error('No file uploaded')
        return res.status(400).send('No file uploaded');
      }

      await handleUpload(req as FileUploadRequest, res);
    } catch (error) {
      console.error('Unexpected error in upload:', error);
      res
        .status(400)
        .send('Upload failed. Please check your file and try again.');
    }
  });
});

async function handleUpload(req: FileUploadRequest, res: Response) {
  const { address } = req.body;

  if (!address) {
    console.error('Address required');
    return res.status(400).send('Address required');
  }

  if (req.file.mimetype !== 'audio/mpeg') {
    console.error('Only MP3 files are allowed')
    return res.status(400).send('Only MP3 files are allowed');
  }

  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || type.mime !== 'audio/mpeg') {
    console.error('Invalid file format: not a valid MP3')
    return res.status(400).send('Invalid file format: not a valid MP3');
  }

  const metadata = await parseBuffer(req.file.buffer, {
    mimeType: 'audio/mpeg',
  });
  const duration = metadata.format.duration;
  if (!duration) {
    console.error('Could not determine MP3 duration. File may be corrupted')
    return res
      .status(400)
      .send('Could not determine MP3 duration. File may be corrupted');
  }

  if (duration > 5) {
    console.error(`MP3 too long: ${duration.toFixed(2)} seconds. Max allowed is 5s`)
    return res
      .status(400)
      .send(`MP3 too long: ${duration.toFixed(2)} seconds. Max allowed is 5s`);
  }

  const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  //TODO: Key building schema will be changed with privy_key integration. For now we take 8 first characters from user's address
  const s3Key = `${address.slice(-8)}`;
  const { s3, S3_BUCKET } = s3Config;

  await s3.send(
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
}

export default router;
