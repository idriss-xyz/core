import { In } from 'typeorm';
import { formatUnits, Hex } from 'viem';
import {
  StoredDonationData,
  TokenDonationData,
  NftDonationData,
  CHAIN_ID_TO_NFT_COLLECTIONS,
} from '@idriss-xyz/constants';
import { fetchPreferredImage, getChainByNetworkName } from '@idriss-xyz/utils';

import { fetchNftFloorFromOpensea } from '../../../apps/creator-api/utils/price-fetchers';

import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { TokenDonation } from './entities/token-donation.entity';
import { NftDonation } from './entities/nft-donation.entity';
import { NftCollection } from './entities/nft-collection.entity';
import { NftToken } from './entities/nft-token.entity';
import { ZapperNode } from './types';
import {
  enrichUserData,
  isActorItem,
  isNftCollectionItem,
  isNftItem,
  isStringItem,
  isTokenItem,
} from './utils';

export async function storeToDatabase(
  edges: { node: ZapperNode }[],
  overwrite = false,
): Promise<StoredDonationData[]> {
  const donationBaseRepo = AppDataSource.getRepository(Donation);
  const tokenDonationRepo = AppDataSource.getRepository(TokenDonation);
  const nftDonationRepo = AppDataSource.getRepository(NftDonation);
  const userRepo = AppDataSource.getRepository(User);
  const tokenRepo = AppDataSource.getRepository(Token);
  const collectionRepo = AppDataSource.getRepository(NftCollection);
  const nftTokenRepo = AppDataSource.getRepository(NftToken);
  const savedDonations: StoredDonationData[] = [];

  const nodes = edges.map((edge) => {
    return edge.node;
  });
  const transactionHashes = nodes.map((node) => {
    return node.transaction.hash;
  });

  const existingDonations = await donationBaseRepo.find({
    where: { transactionHash: In(transactionHashes) },
    select: ['transactionHash'],
  });
  const existingHashes = new Set(
    existingDonations.map((d) => {
      return d.transactionHash;
    }),
  );
  const enrichedUserCache = new Map<
    Hex,
    Awaited<ReturnType<typeof enrichUserData>>
  >();

  for (const node of nodes) {
    if (!overwrite && existingHashes.has(node.transaction.hash)) {
      continue;
    }

    const fromUser = node.transaction.fromUser;
    const fromAddress = fromUser.address.toLowerCase() as Hex;
    let enrichedFromUser = enrichedUserCache.get(fromAddress);
    if (!enrichedFromUser) {
      enrichedFromUser = await enrichUserData({
        address: fromAddress,
        displayName: fromUser.displayName?.value,
        displayNameSource: fromUser.displayName?.source,
        avatarUrl: fromUser.avatar?.value?.url,
        avatarSource: fromUser.avatar?.source,
        farcasterUserData: fromUser.farcasterProfile,
      });
      enrichedUserCache.set(fromAddress, enrichedFromUser);
      await userRepo.upsert(enrichedFromUser, {
        conflictPaths: ['address'],
        skipUpdateIfNoValuesChanged: true,
      });
    }

    const items = node.interpretation.descriptionDisplayItems;
    const actorItem = items.find((element) => {
      return isActorItem(element);
    });
    const stringItem = items.find(isStringItem);
    const tokenItem = items.find(isTokenItem);
    const nftItem = items.find(isNftItem);
    const nftCollectionItem = items.find(isNftCollectionItem);

    const toUser = actorItem?.account;
    let enrichedToUser: typeof enrichedFromUser | undefined;

    if (!toUser?.address) {
      continue;
    }

    if (toUser) {
      const toAddress = toUser.address.toLowerCase() as Hex;
      enrichedToUser = enrichedUserCache.get(toAddress);
      if (!enrichedToUser) {
        enrichedToUser = await enrichUserData({
          address: toAddress,
          displayName: toUser.displayName?.value,
          displayNameSource: toUser.displayName?.source,
          avatarUrl: toUser.avatar?.value?.url,
          avatarSource: toUser.avatar?.source,
          farcasterUserData: toUser.farcasterProfile,
        });
        enrichedUserCache.set(toAddress, enrichedToUser);
        await userRepo.upsert(enrichedToUser, {
          conflictPaths: ['address'],
          skipUpdateIfNoValuesChanged: true,
        });
      }
    }

    /* ──────────── TOKEN donation ──────────── */
    if (tokenItem) {
      const tokenData = tokenItem.tokenV2;
      let existingToken = await tokenRepo.findOneBy({
        address: tokenData.address.toLowerCase() as Hex,
        network: node.network,
      });

      if (!existingToken) {
        existingToken = await tokenRepo.save({
          address: tokenData.address.toLowerCase() as Hex,
          symbol: tokenData.symbol,
          imageUrl: tokenData.imageUrlV2,
          network: node.network,
          decimals: tokenData.decimals,
          name: tokenData.name,
        });
      }

      const amountRaw = tokenItem.amountRaw || '0';
      const tradeValue = tokenData.priceData?.price
        ? Number(formatUnits(BigInt(amountRaw), tokenData.decimals)) *
          tokenData.priceData.price
        : 0;

      // Save base donation row
      const base = donationBaseRepo.create({
        transactionHash: node.transaction.hash,
        fromAddress: fromAddress,
        toAddress: toUser.address.toLowerCase() as Hex,
        timestamp: node.timestamp,
        comment: stringItem?.stringValue,
        tradeValue,
        data: node,
        fromUser: enrichedFromUser,
        toUser: enrichedToUser,
      });
      const savedBase = await donationBaseRepo.save(base);

      // Save token-specific row
      await tokenDonationRepo.save({
        id: savedBase.id,
        tokenAddress: tokenData.address.toLowerCase() as Hex,
        amountRaw: amountRaw,
        network: node.network,
        token: existingToken,
      });

      savedDonations.push({
        ...savedBase,
        kind: 'token',
        tokenAddress: tokenData.address.toLowerCase() as Hex,
        amountRaw,
        network: node.network,
        token: existingToken,
      } satisfies TokenDonationData);
      continue;
    }

    /* ──────────── NFT donation ──────────── */
    if (nftItem) {
      const rawCollectionAddress = nftItem.collectionAddress.toLowerCase();
      const { tokenId, quantity, nftToken } = nftItem;

      const bigIntTokenId = BigInt(tokenId);

      const chain = getChainByNetworkName(node.network);
      const collectionNft =
        chain &&
        CHAIN_ID_TO_NFT_COLLECTIONS[chain.id]?.find((c) => {
          return c.address.toLowerCase() === rawCollectionAddress;
        });
      const slug = collectionNft?.slug;
      const shortName = collectionNft?.shortName;
      const category = collectionNft?.category;
      const collectionName = collectionNft?.name;

      if (!slug || !shortName || !category || !nftToken.name) {
        console.warn(
          `Skipping NFT donation from unsupported collection ${rawCollectionAddress} (${node.network})`,
        );
        continue;
      }

      const floor = slug
        ? await fetchNftFloorFromOpensea(slug, tokenId.toString())
        : null;

      const tradeValue = (floor?.usdValue ?? 0) * quantity;

      /* 1 ─ upsert / fetch collection */
      await collectionRepo.upsert(
        {
          address: rawCollectionAddress as Hex,
          network: node.network,
          name: collectionName, // nullable in entity
          shortName: shortName,
          category: category,
          slug: slug,
          imageUrl: nftToken.mediasV3.images.edges[0]?.node.large,
        },
        {
          conflictPaths: ['address', 'network'],
          skipUpdateIfNoValuesChanged: true,
        },
      );

      /* 2 ─ upsert / fetch token */
      let storedToken = await nftTokenRepo.findOneBy({
        collectionAddress: rawCollectionAddress as Hex,
        network: node.network,
        tokenId: Number(tokenId),
      });

      if (!storedToken) {
        storedToken = await nftTokenRepo.save({
          collectionAddress: rawCollectionAddress as Hex,
          network: node.network,
          tokenId: Number(bigIntTokenId),
          name: nftToken.name,
          imgSmall: nftToken.mediasV3.images.edges[0]?.node.url,
          imgMedium: nftToken.mediasV3.images.edges[0]?.node.medium,
          imgLarge: nftToken.mediasV3.images.edges[0]?.node.large,
          imgPreferred: await fetchPreferredImage(
            bigIntTokenId,
            rawCollectionAddress as Hex,
            chain!.id,
          ),
        });
      }

      /* 3 ─ save base donation row (unchanged) */
      const base = donationBaseRepo.create({
        transactionHash: node.transaction.hash,
        fromAddress: fromAddress,
        toAddress: toUser.address.toLowerCase() as Hex,
        timestamp: node.timestamp,
        comment: stringItem?.stringValue,
        tradeValue,
        data: node,
        fromUser: enrichedFromUser,
        toUser: enrichedToUser,
      });
      const savedBase = await donationBaseRepo.save(base);

      /* 4 ─ save NFT-specific row */
      await nftDonationRepo.save({
        id: savedBase.id,
        nftTokenId: storedToken.id,
        quantity,
      });

      /* 5 ─ return shape stays backward-compatible */
      savedDonations.push({
        ...savedBase,
        kind: 'nft',
        collectionAddress: rawCollectionAddress as Hex,
        tokenId: Number(bigIntTokenId),
        quantity,
        network: node.network,

        /* token meta */
        name: storedToken.name,
        imgSmall: storedToken.imgSmall,
        imgMedium: storedToken.imgMedium,
        imgLarge: storedToken.imgLarge,
        imgPreferred: storedToken.imgPreferred,

        /* collection meta */
        collectionShortName: shortName,
        collectionSlug: slug,
        collectionCategory: category,
      } as NftDonationData);
      continue;
    }

    /* ──────────── NFT donation fallback via deltas (ERC1155 multi-qty) ──────────── */
    if (!nftItem && nftCollectionItem) {
      const rawCollectionAddress =
        nftCollectionItem.collectionAddress.toLowerCase();
      const deltaEdges =
        node.accountDeltasV2?.edges?.flatMap((edge) => {
          return edge.node.nftDeltasV2?.edges ?? [];
        }) ?? [];
      const deltaNodes = deltaEdges
        .map((edge) => {
          return edge.node;
        })
        .filter((n) => {
          return !!n.nft;
        });
      const sentNode =
        deltaNodes.find((n) => {
          return n.amount < 0;
        }) ?? deltaNodes[0];
      if (!sentNode?.nft) {
        console.warn(
          `Skipping NFT donation via deltas: no NFT metadata (tx ${node.transaction.hash})`,
        );
        continue;
      }

      const { tokenId, name, mediasV3 } = sentNode.nft;
      const quantity = Math.abs(sentNode.amount || 0);
      if (quantity <= 0) continue;

      const bigIntTokenId = BigInt(tokenId);
      const chain = getChainByNetworkName(node.network);
      const collectionNft =
        chain &&
        CHAIN_ID_TO_NFT_COLLECTIONS[chain.id]?.find((c) => {
          return c.address.toLowerCase() === rawCollectionAddress;
        });
      const slug = collectionNft?.slug;
      const shortName = collectionNft?.shortName;
      const category = collectionNft?.category;
      const collectionName = collectionNft?.name;

      if (!slug || !shortName || !category || !name) {
        console.warn(
          `Skipping NFT donation from unsupported collection ${rawCollectionAddress} (${node.network})`,
        );
        continue;
      }

      const floor = slug
        ? await fetchNftFloorFromOpensea(slug, tokenId.toString())
        : null;
      const tradeValue = (floor?.usdValue ?? 0) * quantity;

      await collectionRepo.upsert(
        {
          address: rawCollectionAddress as Hex,
          network: node.network,
          name: collectionName,
          shortName,
          category,
          slug,
          imageUrl: mediasV3?.images?.edges?.[0]?.node.large,
        },
        {
          conflictPaths: ['address', 'network'],
          skipUpdateIfNoValuesChanged: true,
        },
      );

      let storedToken = await nftTokenRepo.findOneBy({
        collectionAddress: rawCollectionAddress as Hex,
        network: node.network,
        tokenId: Number(tokenId),
      });
      if (!storedToken) {
        storedToken = await nftTokenRepo.save({
          collectionAddress: rawCollectionAddress as Hex,
          network: node.network,
          tokenId: Number(bigIntTokenId),
          name,
          imgSmall: mediasV3?.images?.edges?.[0]?.node.url,
          imgMedium: mediasV3?.images?.edges?.[0]?.node.medium,
          imgLarge: mediasV3?.images?.edges?.[0]?.node.large,
          imgPreferred: await fetchPreferredImage(
            bigIntTokenId,
            rawCollectionAddress as Hex,
            chain!.id,
          ),
        });
      }

      const base = donationBaseRepo.create({
        transactionHash: node.transaction.hash,
        fromAddress: fromAddress,
        toAddress: toUser.address.toLowerCase() as Hex,
        timestamp: node.timestamp,
        comment: stringItem?.stringValue,
        tradeValue,
        data: node,
        fromUser: enrichedFromUser,
        toUser: enrichedToUser,
      });
      const savedBase = await donationBaseRepo.save(base);

      await nftDonationRepo.save({
        id: savedBase.id,
        nftTokenId: storedToken.id,
        quantity,
      });

      savedDonations.push({
        ...savedBase,
        kind: 'nft',
        collectionAddress: rawCollectionAddress as Hex,
        tokenId: Number(bigIntTokenId),
        quantity,
        network: node.network,
        name: storedToken.name,
        imgSmall: storedToken.imgSmall,
        imgMedium: storedToken.imgMedium,
        imgLarge: storedToken.imgLarge,
        imgPreferred: storedToken.imgPreferred,
        collectionShortName: shortName,
        collectionSlug: slug,
        collectionCategory: category,
      } as NftDonationData);
      continue;
    }
  }
  return savedDonations;
}
