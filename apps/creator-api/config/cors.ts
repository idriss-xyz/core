import { STATIC_ORIGINS } from '@idriss-xyz/constants';
import cors from 'cors';

export const isAllowedOrigin = (origin?: string): boolean =>
  !origin ||
  STATIC_ORIGINS.includes(origin) ||
  origin.endsWith('.ext-twitch.tv') ||
  origin === 'https://extension-files.twitch.tv';

export const openCors = cors({ origin: '*' });

export const tightCors = cors({
  origin(origin, cb) {
    isAllowedOrigin(origin) ? cb(null, true) : cb(new Error('CORS blocked'));
  },
  credentials: true,
});
