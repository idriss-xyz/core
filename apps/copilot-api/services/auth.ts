import jwt from 'jsonwebtoken';
import { dataSource } from '../db';
import { SubscribersEntity } from '../entities/subscribers.entity';
import { createSiweMessage, generateSiweNonce } from 'viem/siwe';
import { ExpiringMap } from '../utils/nonceMap';
import { publicClient } from '../config/publicClient';
import type { Request } from 'express';
import { Hex } from 'viem';
import { expiryTime } from '../constants';
import { PublicKey } from '@solana/web3.js';
import { SolanaSignInInput } from "@solana/wallet-standard-features";
import bs58 from 'bs58';
import nacl from 'tweetnacl';

const subscribersRepo = dataSource.getRepository(SubscribersEntity);

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
  walletAddress: Hex,
  message: string,
  signature: Hex,
) {
  const currentNonce = expiringMap.get(walletAddress);
  return publicClient.verifySiweMessage({
    address: walletAddress,
    nonce: currentNonce,
    message,
    signature,
  });
}

export async function validateSolanaMessage(
  walletAddress: string,
  message: string,
  signature: string,
) {
  try {
    const currentNonce = expiringMap.get(walletAddress);
    if (!currentNonce || !message.includes(currentNonce)) {
      return false;
    }

    const publicKey = new PublicKey(walletAddress);
    const signatureUint8 = bs58.decode(signature);
    const messageUint8 = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKey.toBytes()
    );
  } catch (error) {
    console.error("Solana signature validation error:", error);
    return false;
  }
}

export function createMessage(
  walletAddress: Hex,
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
    uri: `https://${domain}`,
    version: '1',
    issuedAt: timestamp,
    expirationTime: new Date(
      timestamp.setTime(timestamp.getTime() + 10 * 60 * 1000),
    ),
  });
}

// Add Solana message creation
export function createSolanaMessage(
  walletAddress: string,
  domain: string,
) {
  const nonce = generateSiweNonce();
  expiringMap.set(walletAddress, nonce);

  const timestamp = new Date();
  const expirationTime = new Date(timestamp.getTime() + 10 * 60 * 1000);

  const signInData: SolanaSignInInput = {
    address: walletAddress,
    domain,
    statement:
      "Log in to the IDRISS extension",
    uri: `https://${domain}`,
    version: "1",
    nonce,
    chainId: "mainnet",
    issuedAt: timestamp.toISOString(),
    expirationTime: expirationTime.toISOString(),
  };

  return signInData;
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
