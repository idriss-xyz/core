import { Request, Response, Router } from 'express';
import upload from '../config/multer';
import { MulterError } from 'multer';
import { verifyToken } from '../db/middleware/auth.middleware';
import { handleUpload, FileUploadRequest } from '../utils/audio-utils';
import { tightCors } from '../config/cors';

const router = Router();

router.post(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    const privyId = req.user.id;
    if (!privyId) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    upload.single('file')(req, res, async (err: any) => {
      try {
        if (err) {
          if ((err as MulterError).code === 'LIMIT_FILE_SIZE') {
            console.error('File too large. Max allowed is 300KB');
            res.status(400).send('File too large. Max allowed is 300KB');
            return;
          }
          console.error('Multer error:', err);
          res.status(400).send('File upload failed');
          return;
        }

        if (!req.file) {
          console.error('No file uploaded');
          res.status(400).send('No file uploaded');
          return;
        }

        await handleUpload(req as FileUploadRequest, res, privyId);
      } catch (error) {
        console.error('Unexpected error in upload:', error);
        res
          .status(400)
          .send('Upload failed. Please check your file and try again.');
        return;
      }
    });
  },
);

export default router;
