import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database';
import { Creator } from '../entities';

export const verifyToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = await getJWKS();
    if (!key) {
      res.status(401).json({ error: 'Could not get JWKS. Check terminal.' });
      return;
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, key) as any;
      if (!decoded.sub) {
        res.status(401).json({ error: 'Unauthorized: Invalid user' });
        return;
      }

      const creatorsRepo = AppDataSource.getRepository(Creator);
      const dynamicId = (decoded as any).sub;
      const creator = await creatorsRepo.findOne({ where: { dynamicId } });
      (req as any).creator = creator;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
  };
};

const getJWKS = async () => {
  const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${process.env.DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`;
  const response = await fetch(jwksUrl);
  if (!response.ok) {
    console.error('Failed to fetch JWKS:', response.statusText);
    return null;
  }
  const jwks = await response.json();
  const key = jwks.keys[0];
  return jwkToPem(key);
};

const jwkToPem = (jwk: any): string => {
  const jwkToPemLib = require('jwk-to-pem');
  return jwkToPemLib(jwk);
};
