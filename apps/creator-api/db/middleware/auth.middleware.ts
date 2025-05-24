import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database';
import { Creator } from '../entities';

export const verifyToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = await getJWKS();
    if (!key) {
      res.status(401).json({ error: 'Could not get JWKS' });
      return;
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, key);
      console.log("Decoded is: ", decoded);
      // TODO: get the dynamic user id from the decoded token and find the user on db
      // const creatorsRepo = AppDataSource.getRepository(Creator);
      // const dynamicId = (decoded as Request)['user'].id;
      //const user = await creatorsRepo.findOne({ where: { dynamicId } });
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
  };
}

const getJWKS = async () => {
  const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${process.env.DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`;
  const response = await fetch(jwksUrl);
  const jwks = await response.json();
  return jwks;
};
