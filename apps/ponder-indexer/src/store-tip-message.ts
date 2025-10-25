import { formatUnits, Hex } from 'viem';
import {
  getChainById,
  fetchPreferredImage,
  getNftMetadata,
} from '@idriss-xyz/utils';
import {
  NATIVE_COIN_ADDRESS,
  CHAIN_ID_TO_TOKENS,
  CHAIN_ID_TO_NFT_COLLECTIONS,
  StoredDonationData,
  TokenDonationData,
  NftDonationData,
} from '@idriss-xyz/constants';
import { clients } from '@idriss-xyz/blockchain-clients';

import {
  AppDataSource,
  Donation,
  User,
  Token,
  TokenDonation,
  NftDonation,
  NftCollection,
  NftToken,
  getCreatorNameOrAnon,
} from '@idriss-xyz/db';
import {
  fetchNftFloorFromOpensea,
  getAlchemyHistoricalPrice,
  getOldestZapperPrice,
  getZapperPrice,
} from './pricing-utils.js';

const HOURLY_PRICE_CACHE = new Map<string, number>();

async function getOrCreateUser(address: Hex): Promise<User> {
  const addr = address.toLowerCase() as Hex;
  const userRepo = AppDataSource.getRepository(User);
  const existing = await userRepo.findOneBy({ address: addr });
  if (existing) return existing;
  const displayName = await getCreatorNameOrAnon(addr);
  return userRepo.save({ address: addr, displayName });
}

async function getHourlyTokenPriceUSD(
  lookupAddress: Hex,
  network: string,
  ts: number | bigint,
): Promise<number | null> {
  const date = new Date(Number(ts));
  const hourKey = date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const key = `${network}_${lookupAddress.toLowerCase()}_${hourKey}`;
  if (HOURLY_PRICE_CACHE.has(key)) return HOURLY_PRICE_CACHE.get(key) ?? null;

  const price =
    (await getZapperPrice(lookupAddress, network, date)) ??
    (await getAlchemyHistoricalPrice(lookupAddress, network, date)) ??
    getOldestZapperPrice(lookupAddress, network) ??
    null;

  if (price !== null) HOURLY_PRICE_CACHE.set(key, price);
  return price;
}

type TipMessageEvent = {
  chainId: number;
  txHash: Hex;
  blockTimestamp: number | bigint;
  args: {
    sender: Hex;
    recipientAddress: Hex;
    tokenAddress: Hex; // NFT contract or token address from event; may be null address for native
    amount: bigint; // wei for tokens; quantity for ERC1155
    fee: bigint; // not used now
    assetType: number; // 0 native, 1 ERC20, 2 ERC721, 3 ERC1155
    assetId: bigint; // tokenId for NFTs
    message: string;
  };
};

export async function storeTipMessage(
  event: TipMessageEvent,
): Promise<StoredDonationData | null> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const chain = getChainById(event.chainId);
  const network = chain?.dbName;
  if (!network) return null;

  const donationRepo = AppDataSource.getRepository(Donation);
  const tokenRepo = AppDataSource.getRepository(Token);
  const tokenDonationRepo = AppDataSource.getRepository(TokenDonation);
  const collectionRepo = AppDataSource.getRepository(NftCollection);
  const nftTokenRepo = AppDataSource.getRepository(NftToken);
  const nftDonationRepo = AppDataSource.getRepository(NftDonation);

  // Idempotency: case-insensitive hash check
  const existing = await donationRepo
    .createQueryBuilder('d')
    .where('LOWER(d.transaction_hash) = LOWER(:hash)', { hash: event.txHash })
    .getOne();
  if (existing) return null;

  const from = event.args.sender.toLowerCase() as Hex;
  const to = event.args.recipientAddress.toLowerCase() as Hex;
  const tokenAddrDatabase = event.args.tokenAddress.toLowerCase() as Hex;

  const fromUser = await getOrCreateUser(from);
  const toUser = await getOrCreateUser(to);

  const assetType = Number(event.args.assetType);
  const timestampNumber =
    typeof event.blockTimestamp === 'bigint'
      ? Number(event.blockTimestamp)
      : event.blockTimestamp;

  // Token / Native
  if (assetType === 0 || assetType === 1) {
    const lookupAddress =
      assetType === 0 ? (NATIVE_COIN_ADDRESS as Hex) : tokenAddrDatabase;
    const tokenList = CHAIN_ID_TO_TOKENS[event.chainId] ?? [];
    const tokenMeta = tokenList.find((t) => {
      return t.address.toLowerCase() === lookupAddress.toLowerCase();
    });
    if (!tokenMeta) {
      return null;
    }
    const decimals = tokenMeta.decimals;
    const priceUSD = await getHourlyTokenPriceUSD(
      tokenAddrDatabase,
      network,
      timestampNumber,
    );

    const amountRawString = event.args.amount.toString();
    const tradeValue =
      priceUSD === null
        ? 0
        : Number(formatUnits(BigInt(amountRawString), decimals)) * priceUSD;

    let tokenRow = await tokenRepo.findOneBy({
      address: tokenAddrDatabase,
      network,
    });
    if (!tokenRow) {
      tokenRow = await tokenRepo.save({
        address: tokenAddrDatabase,
        network,
        symbol: tokenMeta.symbol,
        name: tokenMeta.name,
        imageUrl: tokenMeta.logo,
        decimals,
      });
    }

    const message = event.args.message ?? '';

    const base = donationRepo.create({
      transactionHash: event.txHash,
      fromAddress: from,
      toAddress: to,
      timestamp: timestampNumber,
      comment: message.trim(),
      tradeValue,
      data: {},
      fromUser,
      toUser,
    });
    const savedBase = await donationRepo.save(base);

    await tokenDonationRepo.save({
      id: savedBase.id,
      tokenAddress: tokenAddrDatabase,
      amountRaw: amountRawString,
      network,
      token: tokenRow,
    });

    const result: TokenDonationData = {
      ...savedBase,
      kind: 'token',
      tokenAddress: tokenAddrDatabase,
      amountRaw: amountRawString,
      network,
      token: tokenRow,
    };
    return result;
  }

  // NFT (ERC721 / ERC1155)
  if (assetType === 2 || assetType === 3) {
    const collectionAddr = tokenAddrDatabase;
    const tokenIdNumber = Number(event.args.assetId);
    const quantity = assetType === 3 ? Number(event.args.amount) : 1;

    const collections = CHAIN_ID_TO_NFT_COLLECTIONS[event.chainId] ?? [];
    const collectionCfg = collections.find((c) => {
      return c.address.toLowerCase() === collectionAddr.toLowerCase();
    });
    if (!collectionCfg) {
      return null;
    }

    // Upsert collection if missing (no updates)
    let collectionRow = await collectionRepo.findOneBy({
      address: collectionAddr,
      network,
    });
    if (!collectionRow) {
      collectionRow = await collectionRepo.save({
        address: collectionAddr,
        network,
        name: collectionCfg.name,
        shortName: collectionCfg.shortName,
        imageUrl: collectionCfg.image,
        slug: collectionCfg.slug,
        category: collectionCfg.category,
      });
    }

    // Upsert token if missing (no updates)
    let nftTokenRow = await nftTokenRepo.findOneBy({
      collectionAddress: collectionAddr,
      network,
      tokenId: tokenIdNumber,
    });

    if (!nftTokenRow) {
      let meta: { name?: string; image?: string } = {
        name: 'Collectible',
        image: undefined,
      };
      try {
        const clientInfo = clients?.find((c) => {
          return c.chain === event.chainId;
        });
        if (!clientInfo) return null;
        meta = (await getNftMetadata(
          clientInfo?.client,
          collectionAddr,
          BigInt(tokenIdNumber),
          assetType,
        ).catch(() => {
          return { name: 'Collectible', image: undefined };
        })) ?? {
          name: 'Collectible',
          image: undefined,
        };
      } catch {
        // ignore and use default meta
      }

      const imgPref = await fetchPreferredImage(
        BigInt(tokenIdNumber),
        collectionAddr,
        event.chainId,
        assetType,
      );

      nftTokenRow = await nftTokenRepo.save({
        collectionAddress: collectionAddr,
        network,
        tokenId: tokenIdNumber,
        name: meta.name ?? 'Collectible',
        imgSmall: meta.image,
        imgMedium: meta.image,
        imgLarge: meta.image,
        imgPreferred: imgPref ?? meta.image,
      });
    }

    // Pricing via floor
    const floor = await fetchNftFloorFromOpensea(
      collectionCfg.slug,
      String(tokenIdNumber),
    ).catch(() => {
      return null;
    });
    const tradeValue = (floor?.usdValue ?? 0) * quantity;
    const message = event.args.message ?? '';

    // Save base row
    const base = donationRepo.create({
      transactionHash: event.txHash,
      fromAddress: from,
      toAddress: to,
      timestamp: timestampNumber,
      comment: message.trim(),
      tradeValue,
      data: {},
      fromUser,
      toUser,
    });
    const savedBase = await donationRepo.save(base);

    // Save NFT donation row
    await nftDonationRepo.save({
      id: savedBase.id,
      nftTokenId: nftTokenRow.id,
      quantity,
    });

    const result: NftDonationData = {
      ...savedBase,
      kind: 'nft',
      collectionAddress: collectionAddr,
      tokenId: tokenIdNumber,
      quantity,
      network,
      name: nftTokenRow.name,
      imgSmall: nftTokenRow.imgSmall,
      imgMedium: nftTokenRow.imgMedium,
      imgLarge: nftTokenRow.imgLarge,
      imgPreferred: nftTokenRow.imgPreferred,
      collectionShortName: collectionRow.shortName,
      collectionSlug: collectionRow.slug,
      collectionCategory: collectionRow.category,
    };
    return result;
  }

  return null;
}
