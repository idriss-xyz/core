import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import {dataSource} from "../db";
import {UsersEntity} from "../entities/users.entity";

dotenv.config()

export const verifyToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
      res.status(401).json({error: "Invalid token"});
      return;
    }

    try {
      const usersRepo = dataSource.getRepository(UsersEntity);
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

      const id: number = (decoded as Request)['user'].id

      const user = await usersRepo.findOne({where: {uuid: id}})

      if (!user) {
        res.status(401).json({error: "Invalid token"});
        return;
      }

      req.user = {
        id: user.uuid
      }

      next();

    } catch (err) {
      res.status(401).json({error: "Invalid token"})
    }
  }
}
