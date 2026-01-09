import rateLimit from 'express-rate-limit';

// Rate limiter for admin endpoints using SECRET_PASSWORD
// 100 requests per day per IP
export const adminRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
