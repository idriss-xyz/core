import {
  arbitrum,
  base,
  linea,
  mainnet,
  mantle,
  optimism,
  polygon,
  zksync,
  scroll,
  celo,
  // avalanche,
} from 'viem/chains';

import {
  AAVEGOTCHI_LOGO,
  BASE_LOGO,
  DAI_LOGO,
  DEGEN_LOGO,
  IDRISS_LOGO,
  ECHELON_PRIME_LOGO,
  ETHEREUM_LOGO,
  MANTLE_LOGO,
  OPTIMISM_LOGO,
  POLYGON_LOGO,
  USDC_LOGO,
  ABSTRACT_LOGO,
  PENGU_LOGO,
  YGG_LOGO,
  PDT_LOGO,
  RONIN_LOGO,
  AXIE_LOGO,
  ARBITRUM_LOGO,
  LINEA_LOGO,
  ZYNK_SYNC_ERA_LOGO,
  SCROLL_LOGO,
  CELO_LOGO,
  BNB_LOGO,
  // AVAX_LOGO,
  // GUNZ_LOGO,
} from './logos';
import { Chain, Token, ChainToken, NftCollection } from './types';

export const STAKER_ADDRESS = '0x085e2DC1b05dcdbE011B5ad377C9f2fcD69B7057';
export const REWARDS_ADDRESS = '0x4D66A8e9Da1F007802338B372aD348B78b455aBB';

export const NATIVE_COIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DUMMY_RECIPIENT = '0x0000000000000000000000000000000000000001';
export const DEMO_ADDRESS = '0x57658D89126610CbD05CAb564b6B13e7E3D1c843';

export const CREATOR_CHAIN = {
  ABSTRACT: {
    id: 2741,
    name: 'Abstract',
    shortName: 'Abstract',
    dbName: 'ABSTRACT_MAINNET',
    logo: ABSTRACT_LOGO,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://api.mainnet.abs.xyz'] } },
    blockExplorers: {
      default: {
        name: 'Evm Explorer',
        url: 'https://abscan.org',
      },
    },
  },
  RONIN: {
    id: 2020,
    name: 'Ronin',
    shortName: 'Ronin',
    dbName: 'RONIN_MAINNET',
    logo: RONIN_LOGO,
    nativeCurrency: {
      name: 'Ronin',
      symbol: 'RON',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://api.roninchain.com/rpc'] } },
    blockExplorers: {
      default: {
        name: 'Evm Explorer',
        url: 'https://app.roninchain.com',
      },
    },
  },
  BASE: {
    ...base,
    blockExplorers: {
      ...base.blockExplorers,
      blockscout: {
        name: 'Blockscout',
        url: 'https://base.blockscout.com',
      },
    },
    shortName: 'Base',
    dbName: 'BASE_MAINNET',
    logo: BASE_LOGO,
  },
  ETHEREUM: {
    ...mainnet,
    blockExplorers: {
      ...mainnet.blockExplorers,
      blockscout: {
        name: 'Blockscout',
        url: 'https://eth.blockscout.com',
      },
    },
    shortName: 'Ethereum',
    dbName: 'ETHEREUM_MAINNET',
    logo: ETHEREUM_LOGO,
  },
  // AVALANCHE: {
  //   ...avalanche,
  //   shortName: 'Avalanche',
  //   dbName: 'AVALANCHE_MAINNET',
  //   logo: AVAX_LOGO,
  // },
} satisfies Record<string, Chain>;

export const CHAIN = Object.assign(CREATOR_CHAIN, {
  ARBITRUM_ONE: {
    ...arbitrum,
    shortName: 'Arbitrum',
    dbName: 'ARBITRUM_MAINNET',
    logo: ARBITRUM_LOGO,
  },
  LINEA: {
    ...linea,
    shortName: 'Linea',
    dbName: 'LINEA_MAINNET',
    logo: LINEA_LOGO,
  },
  ZK_SYNC_ERA: {
    ...zksync,
    shortName: 'ZkSync',
    dbName: 'ZKSYNC_MAINNET',
    logo: ZYNK_SYNC_ERA_LOGO,
  },
  SCROLL: {
    ...scroll,
    shortName: 'Scroll',
    dbName: 'SCROLL_MAINNET',
    logo: SCROLL_LOGO,
  },
  CELO: {
    ...celo,
    shortName: 'Celo',
    dbName: 'CELO_MAINNET',
    logo: CELO_LOGO,
  },
  BNB_CHAIN: {
    id: 56,
    name: 'BNB Chain',
    shortName: 'BNB',
    dbName: 'BINANCE_SMART_CHAIN_MAINNET',
    logo: BNB_LOGO,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://bsc-dataseed.binance.org'] } },
    blockExplorers: {
      default: { name: 'BS Scan', url: 'https://bscscan.com' },
    },
  },
  MANTLE: {
    ...mantle,
    blockExplorers: {
      ...mantle.blockExplorers,
      blockscout: {
        name: 'Blockscout',
        url: 'https://explorer.mantle.xyz/',
      },
    },
    shortName: 'Mantle',
    dbName: 'MANTLE_MAINNET',
    logo: MANTLE_LOGO,
  },
  OPTIMISM: {
    ...optimism,
    blockExplorers: {
      ...optimism.blockExplorers,
      blockscout: {
        name: 'Blockscout',
        url: 'https://optimism.blockscout.com',
      },
    },
    shortName: 'Optimism',
    dbName: 'OPTIMISM_MAINNET',
    logo: OPTIMISM_LOGO,
  },
  POLYGON: {
    ...polygon,
    blockExplorers: {
      ...polygon.blockExplorers,
      blockscout: {
        name: 'Blockscout',
        url: 'https://polygon.blockscout.com',
      },
    },
    shortName: 'Polygon',
    dbName: 'POLYGON_MAINNET',
    logo: POLYGON_LOGO,
  },
}) satisfies Record<string, Chain>;

export const TOKEN = {
  // AVAX: {
  //   name: 'Avalanche',
  //   symbol: 'AVAX',
  //   logo: AVAX_LOGO,
  // },
  ETHEREUM: {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: ETHEREUM_LOGO,
  },
  USDC: {
    name: 'USDC',
    symbol: 'USDC',
    logo: USDC_LOGO,
  },
  DAI: {
    name: 'Dai',
    symbol: 'DAI',
    logo: DAI_LOGO,
  },
  ECHELON_PRIME: {
    name: 'Echelon Prime',
    symbol: 'PRIME',
    logo: ECHELON_PRIME_LOGO,
  },
  PENGU: { name: 'Pudgy Penguins', symbol: 'PENGU', logo: PENGU_LOGO },
  AAVEGOTCHI: {
    name: 'Aavegotchi',
    symbol: 'GHST',
    logo: AAVEGOTCHI_LOGO,
  },
  DEGEN: { name: 'Degen', symbol: 'DEGEN', logo: DEGEN_LOGO },
  IDRISS: { name: 'IDRISS', symbol: 'IDRISS', logo: IDRISS_LOGO },
  YGG: {
    name: 'Yield Guild Games',
    symbol: 'YGG',
    logo: YGG_LOGO,
  },
  AXIE: {
    name: 'Axie Infinity',
    symbol: 'AXS',
    logo: AXIE_LOGO,
  },
  // GUN: {
  //   name: 'Gunz',
  //   symbol: 'GUN',
  //   logo: GUNZ_LOGO,
  // },
  // PIXEL: {
  //   name: 'Pixels',
  //   symbol: 'PIXEL',
  //   logo: PIXELS_LOGO,
  // },
  RONIN: {
    name: 'Ronin',
    symbol: 'RON',
    logo: RONIN_LOGO,
  },
  PDT: {
    name: 'ParagonsDAO',
    symbol: 'PDT',
    logo: PDT_LOGO,
  },
} as const satisfies Record<string, Token>;

export type TokenSymbol = (typeof TOKEN)[keyof typeof TOKEN]['symbol'];

export const CHAIN_ID_TO_TOKENS = {
  [CREATOR_CHAIN.ABSTRACT.id]: [
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1',
    },
    {
      ...TOKEN.PENGU,
      decimals: 18,
      address: '0x9eBe3A824Ca958e4b3Da772D2065518F009CBa62',
    },
  ],
  // [CREATOR_CHAIN.AVALANCHE.id]: [
  //   {
  //     ...TOKEN.AVAX,
  //     decimals: 18,
  //     address: NATIVE_COIN_ADDRESS,
  //   },
  //   {
  //     ...TOKEN.GUN,
  //     decimals: 18,
  //     address: '0x26debd39d5ed069770406fca10a0e4f8d2c743eb',
  //   },
  //   {
  //     ...TOKEN.USDC,
  //     decimals: 6,
  //     address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  //   },
  // ],
  [CREATOR_CHAIN.ETHEREUM.id]: [
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    {
      ...TOKEN.ECHELON_PRIME,
      decimals: 18,
      address: '0xb23d80f5FefcDDaa212212F028021B41DEd428CF',
    },
    {
      ...TOKEN.YGG,
      decimals: 18,
      address: '0x25f8087EAD173b73D6e8B84329989A8eEA16CF73',
    },
    {
      ...TOKEN.PDT,
      decimals: 18,
      address: '0x375aBB85C329753b1Ba849a601438AE77eEc9893',
    },
  ],
  [CREATOR_CHAIN.RONIN.id]: [
    {
      ...TOKEN.RONIN,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: '0xc99a6A985eD2Cac1ef41640596C5A5f9F4E19Ef5',
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x0B7007c13325C48911F73A2daD5FA5dCBf808aDc',
    },
    {
      ...TOKEN.AXIE,
      decimals: 18,
      address: '0x97a9107C1793BC407d6F527b77e7fff4D812bece',
    },
    {
      ...TOKEN.YGG,
      decimals: 18,
      address: '0x1c306872bC82525d72Bf3562E8F0aA3f8F26e857',
    },
    // {
    //   ...TOKEN.PIXEL,
    //   decimals: 18,
    //   address: '0x7eae20d11ef8c779433eb24503def900b9d28ad7',
    // },
  ],
  [CREATOR_CHAIN.BASE.id]: [
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
    {
      ...TOKEN.ECHELON_PRIME,
      decimals: 18,
      address: '0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b',
    },
    {
      ...TOKEN.PDT,
      decimals: 18,
      address: '0xeff2A458E464b07088bDB441C21A42AB4b61e07E',
    },
    {
      ...TOKEN.YGG,
      decimals: 18,
      address: '0xaAC78d1219c08AecC8e37e03858FE885f5EF1799',
    },
    {
      ...TOKEN.IDRISS,
      decimals: 18,
      address: '0x000096630066820566162C94874A776532705231',
    },
  ],
} satisfies Record<string, ChainToken[]>;

export const CHAIN_ID_TO_NFT_COLLECTIONS: Record<number, NftCollection[]> = {
  [CREATOR_CHAIN.ETHEREUM.id]: [
    {
      address: '0x0Fc3DD8C37880a297166BEd57759974A157f0E74',
      name: 'Parallel Avatars',
      standard: 'erc721',
      slug: 'parallel-avatars',
      image:
        'https://i.seadn.io/gcs/files/f77f0f2cc27dd427c69c68e81bfb0b97.gif?h=250&w=250',
      shortName: 'Avatars',
      category: 'Parallel',
    },
    {
      address: '0x76BE3b62873462d2142405439777e971754E8E77',
      name: 'Parallel Alpha',
      standard: 'erc1155',
      slug: 'parallelalpha',
      image:
        'https://i.seadn.io/gae/Nnp8Pdo6EidK7eBduGnAn_JBvFsYGhNGMJ_fHJ_mzGMN_2Khu5snL5zmiUMcSsIqtANh19KqxXDs0iNq_aYbKC5smO3hiCSw9PlL?h=250&w=250',
      shortName: 'Alpha',
      category: 'Parallel',
    },
    {
      address: '0x6811f2f20c42f42656A3c8623aD5e9461b83f719',
      name: 'Parallel Planetfall',
      standard: 'erc1155',
      slug: 'parallelplanetfall',
      image:
        'https://i2.seadn.io/ethereum/3627f87f8cda484d9f4f7b3b633264f5/ce98acde508d20a97a6e3baae442d0/4fce98acde508d20a97a6e3baae442d0.png?h=250&w=250',
      shortName: 'Planetfall',
      category: 'Parallel',
    },
    {
      address: '0x9d764bcf1AFFd83554B7626F22EAB2ffC60590C7',
      name: 'Parallel Battlepass',
      standard: 'erc1155',
      slug: 'parallel-battlepass-cards',
      image:
        'https://i2.seadn.io/ethereum/feb787aaf01b4125871c2f82d06a758a/d9d6c15b41903ed124d673e2b5b651/93d9d6c15b41903ed124d673e2b5b651.png?h=250&w=250',
      shortName: 'Battlepass',
      category: 'Parallel',
    },
    {
      address: '0x6E3bc168F6260Ff54257aE4B56449eFd7aFd5934',
      name: 'Parallel Cosmetics',
      standard: 'erc1155',
      slug: 'parallel-cosmetics',
      image:
        'https://i2.seadn.io/ethereum/feb787aaf01b4125871c2f82d06a758a/d9d6c15b41903ed124d673e2b5b651/93d9d6c15b41903ed124d673e2b5b651.png?h=250&w=250',
      shortName: 'Cosmetics',
      category: 'Parallel',
    },
    {
      address: '0x5302A847E53c7b2ff4DaEa7559F82F02446BEE61',
      name: 'Parallel Lore',
      standard: 'erc1155',
      slug: 'parallellore',
      image:
        'https://i2.seadn.io/ethereum/feb787aaf01b4125871c2f82d06a758a/d9d6c15b41903ed124d673e2b5b651/93d9d6c15b41903ed124d673e2b5b651.png?h=250&w=250',
      shortName: 'Lore',
      category: 'Parallel',
    },
    {
      address: '0x38398a2d7A4278b8d83967E0D235164335A0394A',
      name: 'Parallel Auxillary',
      standard: 'erc1155',
      slug: 'parallel-auxiliary-items',
      image:
        'https://i2.seadn.io/ethereum/feb787aaf01b4125871c2f82d06a758a/d9d6c15b41903ed124d673e2b5b651/93d9d6c15b41903ed124d673e2b5b651.png?h=250&w=250',
      shortName: 'Auxillary',
      category: 'Parallel',
    },
    {
      address: '0x2dE4941fec832D5d2F7Ab69DF397f3E2fB28d391',
      name: 'Parallel Companions',
      standard: 'erc1155',
      slug: 'parallel-companions',
      image:
        'https://i2.seadn.io/ethereum/0dd4bece1f894321b0793b4f7a0d94db/d279f67a2d4a27cfdbb3883564cd14/1dd279f67a2d4a27cfdbb3883564cd14.png?h=250&w=250',
      shortName: 'Companions',
      category: 'Parallel',
    },
  ],
  [CREATOR_CHAIN.BASE.id]: [
    {
      address: '0x206571b68c66E1d112b74d65695043ad2b5F95D5',
      name: 'Parallel Alpha [Base]',
      standard: 'erc1155',
      slug: 'parallel-on-base',
      image:
        'https://i2.seadn.io/ethereum/feb787aaf01b4125871c2f82d06a758a/d9d6c15b41903ed124d673e2b5b651/93d9d6c15b41903ed124d673e2b5b651.png?h=250&w=250',
      shortName: 'Alpha [Base]',
      category: 'Parallel',
    },
    {
      address: '0x8bB4033AF06B363A8391F795A39281bcc3b6197D',
      name: 'Parallel Planetfall [Base]',
      standard: 'erc1155',
      slug: 'planetfall-on-base',
      image:
        'https://i.seadn.io/s/raw/files/33c294ebc43b4b5cf89038e2da83529d.png?h=250&w=250',
      shortName: 'Planetfall [Base]',
      category: 'Parallel',
    },
    {
      address: '0xA7B67cD6B31b73772AE3C8ea784317207194A6f4',
      name: 'Parallel Aftermath',
      standard: 'erc1155',
      slug: 'parallel-aftermath',
      image:
        'https://i.seadn.io/s/raw/files/f782faa4af801c5d31622008bbb5e524.png?h=250&w=250',
      shortName: 'Aftermath',
      category: 'Parallel',
    },
    {
      address: '0xA669ca42f91873d406847D8329233C2703f377cd',
      name: 'Parallel Deception',
      standard: 'erc1155',
      slug: 'parallel-deception',
      image:
        'https://i2.seadn.io/base/0xa669ca42f91873d406847d8329233c2703f377cd/81834cb06121f75a353dcf071b24b9/1c81834cb06121f75a353dcf071b24b9.png?h=250&w=250',
      shortName: 'Deception',
      category: 'Parallel',
    },
    {
      address: '0x504405158f9960A0252a83EE2Fd13167991ADdD6',
      name: 'Parallel Battlepass [Base]',
      standard: 'erc1155',
      slug: 'parallel-battlepass-cards-base',
      image:
        'https://i2.seadn.io/base/0x504405158f9960a0252a83ee2fd13167991addd6/5717f576ac1162e4a1d8dc459e4d28e1.png?h=250&w=250',
      shortName: 'Battlepass [Base]',
      category: 'Parallel',
    },
    {
      address: '0xC6C03D452906aaD9A364989608d947bAc11E478c',
      name: 'Parallel Cosmetics [Base]',
      standard: 'erc1155',
      slug: 'parallel-cosmetics-base',
      image:
        'https://i2.seadn.io/base/2714dae8521e4a7097a5003a0a132d1d/c76c32bd7d1e92fe20eb8782d11936/2dc76c32bd7d1e92fe20eb8782d11936.png?h=250&w=250',
      shortName: 'Cosmetics [Base]',
      category: 'Parallel',
    },
  ],
};

export const DEFAULT_ALLOWED_CHAINS_IDS = [
  CREATOR_CHAIN.ABSTRACT.id,
  CREATOR_CHAIN.BASE.id,
  CREATOR_CHAIN.ETHEREUM.id,
  CREATOR_CHAIN.RONIN.id,
  // CREATOR_CHAIN.AVALANCHE.id,
];

export const EMPTY_HEX = '0x';

export const COPILOT_API_URL = 'https://copilot-api.idriss.xyz';
// export const CREATOR_API_URL = 'https://creators-api.idriss.xyz';
export const CREATOR_API_URL = 'http://localhost:4000';

export const DEFAULT_DONATION_MIN_ALERT_AMOUNT = 1;
export const DEFAULT_DONATION_MIN_TTS_AMOUNT = 3;
export const DEFAULT_DONATION_MIN_SFX_AMOUNT = 10;
export const IDRISS_TOKEN_ADDRESS =
  '0x000096630066820566162c94874a776532705231';

export const TEST_DONATION_MESSAGE = 'This is a test donation';

export const CHAIN_ID_TO_OPENSEA_NETWORK_NAMES: Record<number, string> = {
  [CREATOR_CHAIN.BASE.id]: 'base',
  [CREATOR_CHAIN.ETHEREUM.id]: 'ethereum',
};

export const TEST_TOKEN_DONATION = {
  type: 'test' as const,
  donor: 'idriss_xyz',
  amount: 5, // USD value
  message: TEST_DONATION_MESSAGE,
  sfxText: null,
  avatarUrl:
    'https://res.cloudinary.com/base-web/image/fetch/w_64/f_webp/https%3A%2F%2Fbase.mypinata.cloud%2Fipfs%2Fbafkreicr5lh2f3eumcn4meif5t2pauzeddjjbhjbl4enqrp4ooz4e7on6i%3FpinataGatewayToken%3Df6uqhE35YREDMuFqLvxFLqd-MBRlrJ1qWog8gyCF8T88-Tsiu2IX48F-kyVti78J',
  txnHash: '0x22f0f25140b9fe35cc01722bb5b0366dcb68bb1bcaee3415ca9f48ce4e57d972',
  token: {
    amount: 1_000_000_000_000,
    details: {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
  },
};

export const TEST_NFT_DONATION = {
  type: 'test' as const,
  donor: 'idriss_xyz',
  amount: 2, // USD value
  message: TEST_DONATION_MESSAGE,
  sfxText: null,
  avatarUrl:
    'https://res.cloudinary.com/base-web/image/fetch/w_64/f_webp/https%3A%2F%2Fbase.mypinata.cloud%2Fipfs%2Fbafkreicr5lh2f3eumcn4meif5t2pauzeddjjbhjbl4enqrp4ooz4e7on6i%3FpinataGatewayToken%3Df6uqhE35YREDMuFqLvxFLqd-MBRlrJ1qWog8gyCF8T88-Tsiu2IX48F-kyVti78J',
  txnHash: '0x22f0f25140b9fe35cc01722bb5b0366dcb68bb1bcaee3415ca9f48ce4e57d972',
  token: {
    amount: 2,
    details: {
      id: '100400158',
      name: 'High-Density Genetic Replicator',
      logo: 'https://nftmedia.parallelnft.com/parallel-aftermath/QmPPNj5MpR9FcxzPUu2gKQygNp5gxNvxwGgTkAGaef6mX9/image.png',
      collectionName: 'Parallel Aftermath',
    },
  },
};
