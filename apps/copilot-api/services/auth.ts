import jwt from 'jsonwebtoken';
import { dataSource } from '../db';
import { SubscribersEntity } from '../entities/subscribers.entity';
import { createSiweMessage, generateSiweNonce } from 'viem/siwe';
import { ExpiringMap } from '../utils/nonceMap';
import { publicClient } from '../config/publicClient';
import type { Request } from 'express';

const subscribersRepo = dataSource.getRepository(SubscribersEntity);

const expiryTime = 5 * 60 * 1000;
const expiringMap = new ExpiringMap<string, string>(expiryTime);

export async function login(walletAddress: string): Promise<string> {
  const existingAddress = await subscribersRepo.findOne({
    where: { subscriber_id: walletAddress },
  });

  if (!existingAddress) {
    await subscribersRepo.save({ subscriber_id: walletAddress });
  }

  const payload = {
    user: {
      id: walletAddress,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '60d',
  });
}

export async function validateMessage(
  walletAddress: `0x${string}`,
  message: string,
  signature: `0x${string}`,
) {
  const currentNonce = expiringMap.get(walletAddress);
  return publicClient.verifySiweMessage({
    address: walletAddress,
    nonce: currentNonce,
    message,
    signature,
  });
}

export async function createMessage(
  walletAddress: `0x${string}`,
  chainId: number,
  domain: string,
) {
  const nonce = generateSiweNonce();
  expiringMap.set(walletAddress, nonce);

  const timestamp = new Date();
  return createSiweMessage({
    statement: 'Log in to the IDRISS extension',
    address: walletAddress,
    chainId,
    domain,
    nonce,
    uri: `https://${domain}`, // TODO: Change for production
    version: '1',
    issuedAt: timestamp,
    expirationTime: new Date(
      timestamp.setTime(timestamp.getTime() + 10 * 60 * 1000),
    ),
  });
}

export async function validateToken(
  token: string,
): Promise<SubscribersEntity | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const subscriber_id: string = (decoded as Request)['user'].id;

    return subscribersRepo.findOne({ where: { subscriber_id } });
  } catch (err) {
    return null;
  }
}
