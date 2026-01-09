import { RequestHandler } from 'express';
import { timingSafeEqual } from '../utils/timing-safe';

/**
 * Middleware to require admin secret authentication.
 * Accepts secret via query param (?secret=) or header (x-admin-secret).
 */
export const requireAdminSecret: RequestHandler = (req, res, next) => {
  const secret =
    (req.query.secret as string) || (req.headers['x-admin-secret'] as string);

  if (!timingSafeEqual(secret, process.env.SECRET_PASSWORD)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};
