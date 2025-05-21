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
  ALEPH_LOGO,
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

export const NATIVE_COIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const CREATOR_CHAIN = {
  ABSTRACT: {
    id: 2741,
    name: 'Abstract',
    shortName: 'Abstract',
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
  ALEPH: {
    id: 41_455,
    name: 'Aleph Zero EVM',
    shortName: 'Aleph',
    logo: ALEPH_LOGO,
    nativeCurrency: {
      name: 'AZERO',
      symbol: 'AZERO',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://rpc.alephzero.raas.gelato.cloud'] } },
    blockExplorers: {
      default: {
        name: 'Evm Explorer',
        url: 'https://evm-explorer.alephzero.org',
      },
    },
  },
  RONIN: {
    id: 2020,
    name: 'Ronin',
    shortName: 'Ronin',
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
    logo: ETHEREUM_LOGO,
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
    logo: POLYGON_LOGO,
  },
} satisfies Record<string, Chain>;

export const CHAIN = Object.assign(CREATOR_CHAIN, {
  ARBITRUM_ONE: {
    ...arbitrum,
    shortName: 'Arbitrum',
    logo: ARBITRUM_LOGO,
  },
  LINEA: {
    ...linea,
    shortName: 'Linea',
    logo: LINEA_LOGO,
  },
  ZK_SYNC_ERA: {
    ...zksync,
    shortName: 'ZkSync',
    logo: ZYNK_SYNC_ERA_LOGO,
  },
  SCROLL: {
    ...scroll,
    shortName: 'Scroll',
    logo: SCROLL_LOGO,
  },
  CELO: {
    ...celo,
    shortName: 'Celo',
    logo: CELO_LOGO,
  },
  BNB_CHAIN: {
    id: 56,
    name: 'BNB Chain',
    shortName: 'BNB',
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
  [CREATOR_CHAIN.ALEPH.id]: [
    {
      ...TOKEN.USDC,
      name: 'USDC',
      decimals: 6,
      address: '0x4Ca4B85Ead5EA49892d3a81DbfAE2f5c2F75d53D',
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
      ...TOKEN.DAI,
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    {
      ...TOKEN.ECHELON_PRIME,
      decimals: 18,
      address: '0xb23d80f5FefcDDaa212212F028021B41DEd428CF',
    },
    {
      ...TOKEN.AAVEGOTCHI,
      decimals: 18,
      address: '0x3F382DbD960E3a9bbCeaE22651E88158d2791550',
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
  [CREATOR_CHAIN.OPTIMISM.id]: [
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    },
    {
      ...TOKEN.DAI,
      decimals: 18,
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
  ],
  [CREATOR_CHAIN.POLYGON.id]: [
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    },
    {
      ...TOKEN.DAI,
      decimals: 18,
      address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    },
    {
      ...TOKEN.AAVEGOTCHI,
      decimals: 18,
      address: '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
    },
    {
      ...TOKEN.YGG,
      decimals: 18,
      address: '0x82617aa52dddf5ed9bb7b370ed777b3182a30fd1',
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
  [CREATOR_CHAIN.MANTLE.id]: [
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    },
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
      ...TOKEN.DAI,
      decimals: 18,
      address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
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
      ...TOKEN.DEGEN,
      decimals: 18,
      address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
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
  CREATOR_CHAIN.ALEPH.id,
  CREATOR_CHAIN.BASE.id,
  CREATOR_CHAIN.ETHEREUM.id,
  CREATOR_CHAIN.MANTLE.id,
  CREATOR_CHAIN.OPTIMISM.id,
  CREATOR_CHAIN.POLYGON.id,
  CREATOR_CHAIN.RONIN.id,
];

export const EMPTY_HEX = '0x';

export const COPILOT_API_URL = 'https://copilot-api.idriss.xyz';

export const DONATION_MIN_ALERT_AMOUNT = 1;
export const DONATION_MIN_TTS_AMOUNT = 5;
export const DONATION_MIN_SFX_AMOUNT = 10;
