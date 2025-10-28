import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource, Creator } from '@idriss-xyz/db';

const getPrivyPublicKey = () => {
  // The public key from your .env file
  const key = process.env.PRIVY_PUBLIC_VERIFICATION_KEY;
  if (!key) throw new Error('PRIVY_PUBLIC_VERIFICATION_KEY is not set');
  return key.replace(/\\n/g, '\n');
};

export const verifyToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const publicKey = getPrivyPublicKey();
      const decoded = jwt.verify(token, publicKey, {
        issuer: 'privy.io',
        audience: process.env.PRIVY_APP_ID,
      }) as any;

      if (!decoded.sub) {
        res.status(401).json({ error: 'Unauthorized: Invalid user' });
        return;
      }

      const privyId = decoded.sub;

      // We only check req.user on patch routes, on post it's ok to have empty string
      req.user = { id: privyId };
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
  };
};
