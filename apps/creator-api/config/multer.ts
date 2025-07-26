import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 }, // 300 KB limit
});

export default upload;
