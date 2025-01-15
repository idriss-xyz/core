import express from 'express';
import type {Request, Response} from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {throwInternalError} from '../middleware/error.middleware';
import {isAddress} from 'viem';
import {dataSource} from '../db';
import {createSiweMessage, generateSiweNonce} from 'viem/siwe';
import {publicClient} from '../config/publicClient';
import {join} from 'path';
import {mode} from '../utils/mode';
import {SubscribersEntity} from "../entities/subscribers.entity";

dotenv.config(
  mode === 'production' ? {} : {path: join(__dirname, `.env.${mode}`)},
);

const router = express.Router();

const subscribersRepo = dataSource.getRepository(SubscribersEntity);

router.post('/login', async (req: Request, res: Response) => {
  const {signature, walletAddress, message} = req.body;

  if (!isAddress(walletAddress)) {
    res.status(403).json({error: 'Invalid wallet address'});
    return;
  }

  try {
    const valid = await publicClient.verifySiweMessage({
      address: walletAddress,
      message,
      signature,
    });

    if (!valid) {
      res.status(403).json({error: 'Invalid signature'});
      return;
    }

    const existingAddress = await subscribersRepo.findOne({
      where: {subscriber_id: walletAddress},
    });

    if (!existingAddress) {
      await subscribersRepo.save({subscriber_id: walletAddress})
    }

    const payload = {
      user: {
        id: walletAddress,
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
    const {walletAddress, chainId, domain} = req.body;
    const nonce = generateSiweNonce();
    const timestamp = new Date();

    const message = createSiweMessage({
      statement: 'Log in to the IDRISS extension',
      address: walletAddress,
      chainId,
      domain,
      nonce,
      uri: `https://${domain}`, // TODO: Change for production
      version: '1',
      issuedAt: timestamp,
      expirationTime: new Date(timestamp.setDate(timestamp.getDate() + 1)),
    });

    res.status(200).json({nonce, message});
  } catch (err) {
    throwInternalError(res, 'Error generating login message: ', err);
  }
});

router.post('/verify-token', async (req, res) => {
  const {token} = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const subscriber_id: string = (decoded as Request)['user'].id;

    const user = await subscribersRepo.findOne({where: {subscriber_id}})

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
