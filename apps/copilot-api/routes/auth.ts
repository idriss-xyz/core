import express from 'express';
import type {Request, Response} from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {throwInternalError} from '../middleware/error.middleware';
import {isAddress, verifyMessage} from 'viem';
import {dataSource} from '../db';
import {AddressesEntity} from '../entities/addreesses.entity';
import {UsersEntity} from '../entities/users.entity';
import {v4 as uuidv4} from 'uuid';

dotenv.config();

const router = express.Router();

const addressesRepo = dataSource.getRepository(AddressesEntity);
const usersRepo = dataSource.getRepository(UsersEntity);

router.post('/login', async (req: Request, res: Response) => {
  const {signature, walletAddress, challengeMessage} = req.body;

  if (!isAddress(walletAddress)) {
    res.status(403).json({error: 'Invalid wallet address'});
    return;
  }

  try {
    const valid_address = await verifyMessage({
      signature,
      address: walletAddress,
      message: challengeMessage
    });

    if (!valid_address) {
      res.status(403).json({error: 'Invalid signature'});
      return;
    }

    const existingAddress = await addressesRepo.findOne({
      where: {address: walletAddress},
    });

    const user = await usersRepo.findOne({
      where: {uuid: existingAddress?.userId},
    });

    if (!user) {
      const newUser = await usersRepo.save({});
      const payload = {
        user: {
          id: newUser.uuid,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
      });

      res.status(200).send({token});
      return;
    }

    const payload = {
      user: {
        id: user.uuid,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.status(200).send({token});
  } catch (err) {
  }
});

router.post('/wallet-address', async (req, res) => {
  try {
    const {walletAddress} = req.body;
    const nonce = uuidv4();
    const timestamp = new Date().toISOString();
    const challengeMessage = `
            Challenge: ${process.env.CHALLENGE_SECRET},
            Wallet Address: ${walletAddress},
            Nonce: ${nonce},
            Timestamp: ${timestamp}
        `
      .replace(/\\s+/g, ' ')
      .trim();
    res.status(200).json({nonce, challengeMessage});
  } catch (err) {
    throwInternalError(res, 'Error generating challenge message: ', err);
  }
});

router.post('/verify-token', async (req, res) => {
  const {token} = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const id: number = (decoded as Request)['user'].id;

    const user = await usersRepo.findOne({where: {uuid: id}});

    if (!user) {
      res.status(401).json({error: 'Invalid token'});
      return;
    }

    res.status(200).send();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

export default router;
