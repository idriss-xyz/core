import { Hex } from 'viem';
import { AppDataSource } from './database';
import { TokenDonation } from './entities/token-donation.entity';
import { NftDonation } from './entities/nft-donation.entity';
import { Donation } from './entities/donations.entity';
import {
  StoredDonationData,
  TokenDonationData,
  NftDonationData,
} from '@idriss-xyz/constants';

async function getTokenAndNftRows(
  where: object,
  needTokenRelation = false,
): Promise<StoredDonationData[]> {
  const tokenRepo = AppDataSource.getRepository(TokenDonation);
  const nftRepo = AppDataSource.getRepository(NftDonation);

  const applyBase = (w: object) =>
    Object.keys(w).length ? ({ base: w } as object) : {};

  const tokenRows = await tokenRepo.find({
    where: applyBase(where),
    relations: needTokenRelation
      ? ['base', 'base.fromUser', 'base.toUser', 'token']
      : ['base', 'base.fromUser', 'base.toUser'],
  });

  const nftRows = await nftRepo.find({
    where: applyBase(where),
    relations: [
      'base',
      'base.fromUser',
      'base.toUser',
      'nft',
      'nft.collection',
    ],
  });

  const tokenDtos: TokenDonationData[] = tokenRows.map((t) => ({
    ...t.base, // parent columns
    kind: 'token',
    tokenAddress: t.tokenAddress,
    amountRaw: t.amountRaw,
    network: t.network,
    token: t.token,
  }));

  const nftDtos: NftDonationData[] = nftRows.map((n) => ({
    ...n.base,
    kind: 'nft',
    collectionAddress: n.nft.collectionAddress,
    tokenId: n.nft.tokenId,
    quantity: n.quantity,
    network: n.nft.network,

    name: n.nft.name,
    imgSmall: n.nft.imgSmall,
    imgMedium: n.nft.imgMedium,
    imgLarge: n.nft.imgLarge,
    imgPreferred: n.nft.imgPreferred,

    collectionShortName: n.nft.collection.shortName,
    collectionSlug: n.nft.collection.slug,
    collectionCategory: n.nft.collection.category,
  }));

  return [...tokenDtos, ...nftDtos];
}

export async function fetchDonationsByToAddress(
  toAddress: Hex,
): Promise<StoredDonationData[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donations = await getTokenAndNftRows(
    { toAddress: toAddress.toLowerCase() },
    true,
  );

  return donations;
}

export async function fetchDonationsByFromAddress(
  fromAddress: Hex,
): Promise<StoredDonationData[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donations = await getTokenAndNftRows(
    { fromAddress: fromAddress.toLowerCase() },
    true,
  );
  return donations;
}

export async function fetchDonations(): Promise<
  Record<Hex, StoredDonationData[]>
> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donations = await getTokenAndNftRows({}, true);

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const key = donation.fromAddress.toLowerCase() as Hex;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation);
      return acc;
    },
    {} as Record<Hex, StoredDonationData[]>,
  );

  return groupedDonations;
}

export async function fetchDonationRecipients(): Promise<
  Record<Hex, StoredDonationData[]>
> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donations = await getTokenAndNftRows({}, true);

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const key = donation.toAddress.toLowerCase() as Hex;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation);
      return acc;
    },
    {} as Record<Hex, StoredDonationData[]>,
  );

  return groupedDonations;
}

export async function fetchAllKnownDonationHashes(): Promise<Set<string>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    select: ['transactionHash'],
  });

  return new Set(donations.map((d) => d.transactionHash.toLowerCase()));
}
