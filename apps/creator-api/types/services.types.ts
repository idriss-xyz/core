import { Hex } from 'viem';
import { StoredDonationData, LeaderboardStats } from '@idriss-xyz/constants';
import { LAMBDA_FAUCET, LAMBDA_REWARDS } from '../config/aws-config';

export interface TokenDisplayItem {
  __typename: 'TokenDisplayItem';
  network: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

export interface NftDisplayItem {
  __typename: 'NFTDisplayItem';
  tokenId: string;
  type: string;
  collectionAddress: Hex;
  quantity: number;
  nftToken: {
    name: string;
    mediasV3: {
      images: {
        edges: {
          node: {
            large: string;
            medium: string;
            url: string;
          };
        }[];
      };
    };
  };
}

export type StringDisplayItem = {
  __typename: 'StringDisplayItem';
  stringValue: string;
};

export interface ActorDisplayItem {
  __typename: 'ActorDisplayItem';
  account: UserData;
}

export interface NftCollectionDisplayItem {
  __typename: 'NFTCollectionDisplayItem';
  collectionAddress: Hex;
  type: string;
  nftCollection: { displayName?: string | null } | null;
}

type DisplayItem =
  | TokenDisplayItem
  | NftDisplayItem
  | StringDisplayItem
  | ActorDisplayItem
  | NftCollectionDisplayItem;

export interface FarcasterUserData {
  username: string;
  metadata: {
    displayName: string;
    imageUrl: string | undefined;
  };
}

type UserData = {
  address: Hex;
  displayName: {
    value: string;
    source: string;
  };
  avatar: {
    value: {
      url: string | undefined;
    };
    source: string | undefined;
  };
  farcasterProfile: FarcasterUserData | undefined;
};

interface TokenV2 {
  symbol: string;
  imageUrlV2?: string;
  priceData: {
    price: number;
  };
  address: Hex;
  decimals: number;
  name: string;
}

export interface ZapperNode {
  timestamp: number;
  network: string;
  transaction: {
    hash: Hex;
    fromUser: UserData;
    toUser: {
      address: Hex;
    };
    decodedInputV2: {
      data: {
        value: string;
        name: string;
      }[];
    };
  };
  interpretation: {
    descriptionDisplayItems: DisplayItem[];
  };
  accountDeltasV2?: {
    edges: {
      node: {
        nftDeltasV2?: {
          edges: {
            node: {
              nft: {
                tokenId: string;
                name?: string;
                mediasV3: {
                  images: {
                    edges: {
                      node: { large: string; medium: string; url: string };
                    }[];
                  };
                };
              } | null;
              amount: number;
            };
          }[];
        };
      };
    }[];
  };
  app?: {
    slug: string;
  };
}

export interface AppHistoryVariables {
  slug: string;
  after?: string | null;
}

interface AppTimeline {
  edges: {
    node: ZapperNode;
  }[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export interface ZapperResponse {
  data: { transactionsForAppV2: AppTimeline };
}

export interface TipHistoryResponse {
  donations: StoredDonationData[];
  leaderboard: LeaderboardStats[];
}

export type LambdaName = typeof LAMBDA_FAUCET | typeof LAMBDA_REWARDS;

export type LambdaPayload = {
  recipient: Hex;
  amount: string | bigint;
  chainId: string;
  nonce: number;
};

export type LambdaResponse = {
  Payload?: Uint8Array;
  FunctionError?: string;
};

export type DecodedLambdaBody = Record<string, any>;
