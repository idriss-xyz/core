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
} from './logos';
import { Chain, Token, ChainToken } from './types';

export const STAKER_ADDRESS = '0x085e2DC1b05dcdbE011B5ad377C9f2fcD69B7057';
export const REWARDS_ADDRESS = '0x4D66A8e9Da1F007802338B372aD348B78b455aBB';

export const NATIVE_COIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DUMMY_RECIPIENT = '0x0000000000000000000000000000000000000001';

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
      address: '0x84a71ccd554cc1b02749b35d22f684cc8ec987e1',
    },
    {
      ...TOKEN.PENGU,
      decimals: 18,
      address: '0x9eBe3A824Ca958e4b3Da772D2065518F009CBa62',
    },
  ],
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
      address: '0x25f8087ead173b73d6e8b84329989a8eea16cf73',
    },
    {
      ...TOKEN.PDT,
      decimals: 18,
      address: '0x375abb85c329753b1ba849a601438ae77eec9893',
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
      address: '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5',
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x0b7007c13325c48911f73a2dad5fa5dcbf808adc',
    },
    {
      ...TOKEN.AXIE,
      decimals: 18,
      address: '0x97a9107c1793bc407d6f527b77e7fff4d812bece',
    },
    {
      ...TOKEN.YGG,
      decimals: 18,
      address: '0x1c306872bc82525d72bf3562e8f0aa3f8f26e857',
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
      address: '0xeff2a458e464b07088bdb441c21a42ab4b61e07e',
    },
    {
      ...TOKEN.YGG,
      decimals: 18,
      address: '0xaac78d1219c08aecc8e37e03858fe885f5ef1799',
    },
    {
      ...TOKEN.IDRISS,
      decimals: 18,
      address: '0x000096630066820566162c94874a776532705231',
    },
  ],
} satisfies Record<string, ChainToken[]>;

export const DEFAULT_ALLOWED_CHAINS_IDS = [
  CREATOR_CHAIN.ABSTRACT.id,
  CREATOR_CHAIN.BASE.id,
  CREATOR_CHAIN.ETHEREUM.id,
  CREATOR_CHAIN.RONIN.id,
];

export const EMPTY_HEX = '0x';

export const COPILOT_API_URL = 'https://copilot-api.idriss.xyz';
export const CREATOR_API_URL = 'https://core-production-a116.up.railway.app';

export const DEFAULT_DONATION_MIN_ALERT_AMOUNT = 1;
export const DEFAULT_DONATION_MIN_TTS_AMOUNT = 3;
export const DEFAULT_DONATION_MIN_SFX_AMOUNT = 10;
export const IDRISS_TOKEN_ADDRESS =
  '0x000096630066820566162c94874a776532705231';
