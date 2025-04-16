import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dataSource } from '../db';
import { SubscribersEntity } from '../entities/subscribers.entity';


export const verifyToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    try {
      const subscribersRepo = dataSource.getRepository(SubscribersEntity);
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      const subscriber_id: string = (decoded as Request)['user'].id;

      const user = await subscribersRepo.findOne({ where: { subscriber_id } });

      if (!user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      req.user = {
        id: subscriber_id,
      };

      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
