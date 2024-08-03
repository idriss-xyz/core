import {
  AAVEGOTCHI_LOGO,
  ARBITRUM_LOGO,
  BANKLESS_DAO_LOGO,
  BASE_LOGO,
  BNB_LOGO,
  BNB_TOKEN_LOGO,
  CULT_DAO_LOGO,
  DAI_LOGO,
  DEGEN_LOGO,
  DOGECOIN_LOGO,
  ECHELON_PRIME_LOGO,
  ETHEREUM_LOGO,
  LINEA_LOGO,
  MANTLE_LOGO,
  OPTIMISM_LOGO,
  POLYGON_LOGO,
  RVLT_LOGO,
  SCROLL_LOGO,
  // TETHER_LOGO,
  USDC_LOGO,
  WETH_LOGO,
  ZYNK_SYNC_ERA_LOGO,
} from './logos';
import { Chain, Token, ChainToken } from './types';

export const NATIVE_COIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const CHAIN = {
  POLYGON: {
    id: 137,
    name: 'Polygon Mainnet',
    logo: POLYGON_LOGO,
    // TODO: move nativeCurrency to CHAIN_TO_TOKEN_IN_CHAIN, probably something isNative: true,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygon.blockscout.com'],
  },
  ARBITRUM_ONE: {
    id: 42_161,
    name: 'Arbitrum One',
    logo: ARBITRUM_LOGO,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arbitrum.llamarpc.com'],
    blockExplorerUrls: ['https://arbitrum.blockscout.com'],
  },
  OPTIMISM: {
    id: 10,
    name: 'Optimism',
    logo: OPTIMISM_LOGO,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimism.blockscout.com'],
  },
  BASE: {
    id: 8453,
    name: 'Base',
    logo: BASE_LOGO,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://base.blockscout.com'],
  },
  LINEA: {
    id: 59_144,
    name: 'Linea',
    logo: LINEA_LOGO,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.linea.build'],
    blockExplorerUrls: ['https://lineascan.build'],
  },
  ZK_SYNC_ERA: {
    id: 324,
    name: 'zkSync Era',
    logo: ZYNK_SYNC_ERA_LOGO,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.era.zksync.io'],
    blockExplorerUrls: ['https://zksync.blockscout.com'],
  },
  MANTLE: {
    id: 5000,
    name: 'Mantle',
    logo: MANTLE_LOGO,
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18,
    },
    rpcUrls: ['https://mantle.publicnode.com'],
    blockExplorerUrls: ['https://explorer.mantle.xyz'],
  },
  SCROLL: {
    id: 534_352,
    name: 'Scroll',
    logo: SCROLL_LOGO,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.scroll.io'],
    blockExplorerUrls: ['https://scrollscan.com'],
  },
  BNB_CHAIN: {
    id: 56,
    name: 'BNB Chain',
    logo: BNB_LOGO,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    logo: ETHEREUM_LOGO,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://eth.blockscout.com/'],
  },
} satisfies Record<string, Chain>;

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
  // TETHER: {
  //   name: 'Tether',
  //   symbol: 'USDT',
  //   logo: TETHER_LOGO,
  // },
  ECHELON_PRIME: {
    name: 'Echelon Prime',
    symbol: 'PRIME',
    logo: ECHELON_PRIME_LOGO,
  },
  CULT_DAO: {
    name: 'Cult DAO',
    symbol: 'CULT',
    logo: CULT_DAO_LOGO,
  },
  BANKLESS_DAO: {
    name: 'Bankless DAO',
    symbol: 'BANK',
    logo: BANKLESS_DAO_LOGO,
  },
  AAVEGOTCHI: {
    name: 'Aavegotchi',
    symbol: 'GHST',
    logo: AAVEGOTCHI_LOGO,
  },
  OPTIMISM: { name: 'Optimism', symbol: 'OP', logo: OPTIMISM_LOGO },
  BNB: { name: 'BNB', symbol: 'BNB', logo: BNB_TOKEN_LOGO },
  WETH: { name: 'WETH', symbol: 'WETH', logo: WETH_LOGO },
  DOGECOIN: { name: 'Dogecoin', symbol: 'DOGE', logo: DOGECOIN_LOGO },
  POLYGON: {
    name: 'Polygon',
    symbol: 'MATIC',
    logo: POLYGON_LOGO,
  },
  REVOLT2EARN: { name: 'Revolt 2 Earn', symbol: 'RVLT', logo: RVLT_LOGO },
  MANTLE: { name: 'Mantle', symbol: 'MNT', logo: MANTLE_LOGO },
  DEGEN: { name: 'Degen', symbol: 'DEGEN', logo: DEGEN_LOGO },
} satisfies Record<string, Token>;

export const CHAIN_ID_TO_TOKENS = {
  [CHAIN.ETHEREUM.id]: [
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
    // {
    //   ...TOKEN.TETHER,
    //   decimals: 6,
    //   address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    // },
    {
      ...TOKEN.ECHELON_PRIME,
      decimals: 18,
      address: '0xb23d80f5FefcDDaa212212F028021B41DEd428CF',
    },
    {
      ...TOKEN.CULT_DAO,
      decimals: 18,
      address: '0xf0f9d895aca5c8678f706fb8216fa22957685a13',
    },
    {
      ...TOKEN.BANKLESS_DAO,
      decimals: 18,
      address: '0x2d94aa3e47d9d5024503ca8491fce9a2fb4da198',
    },
    {
      ...TOKEN.AAVEGOTCHI,
      decimals: 18,
      address: '0x3F382DbD960E3a9bbCeaE22651E88158d2791550',
    },
  ],
  [CHAIN.OPTIMISM.id]: [
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
    {
      ...TOKEN.OPTIMISM,
      decimals: 18,
      address: '0x4200000000000000000000000000000000000042',
    },
  ],
  [CHAIN.BNB_CHAIN.id]: [
    {
      ...TOKEN.BNB,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 18,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    },
    {
      ...TOKEN.DAI,
      decimals: 18,
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    },
    {
      ...TOKEN.WETH,
      name: 'ETH on BSC',
      decimals: 18,
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    },
    {
      ...TOKEN.DOGECOIN,
      decimals: 8,
      address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    },
  ],
  [CHAIN.POLYGON.id]: [
    {
      ...TOKEN.POLYGON,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
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
    // {
    //   ...TOKEN.TETHER,
    //   decimals: 6,
    //   address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    // },
    {
      ...TOKEN.WETH,
      decimals: 18,
      name: 'ETH on Polygon',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    },
    {
      ...TOKEN.REVOLT2EARN,
      decimals: 18,
      address: '0xf0f9D895aCa5c8678f706FB8216fa22957685A13',
    },
    {
      ...TOKEN.BANKLESS_DAO,
      decimals: 18,
      address: '0xdb7cb471dd0b49b29cab4a1c14d070f27216a0ab',
    },
    {
      ...TOKEN.AAVEGOTCHI,
      decimals: 18,
      address: '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
    },
  ],
  [CHAIN.ZK_SYNC_ERA.id]: [
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    },
  ],
  [CHAIN.MANTLE.id]: [
    {
      ...TOKEN.MANTLE,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    },
  ],
  [CHAIN.BASE.id]: [
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
      ...TOKEN.DEGEN,
      decimals: 18,
      address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    },
  ],
  [CHAIN.SCROLL.id]: [
    {
      ...TOKEN.ETHEREUM,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    },
    {
      ...TOKEN.DAI,
      decimals: 18,
      address: '0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97',
    },
  ],
  [CHAIN.LINEA.id]: [
    {
      ...TOKEN.ETHEREUM,
      name: 'LineaETH',
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    },
    {
      ...TOKEN.DAI,
      decimals: 18,
      address: '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5',
    },
  ],
} satisfies Record<string, ChainToken[]>;

export const EMPTY_HEX = '0x';
