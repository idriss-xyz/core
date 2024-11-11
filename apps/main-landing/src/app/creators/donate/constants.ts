import { base, mainnet, mantle, optimism, polygon } from 'viem/chains';

import {
  AAVEGOTCHI_LOGO,
  BASE_LOGO,
  DAI_LOGO,
  DEGEN_LOGO,
  ECHELON_PRIME_LOGO,
  ETHEREUM_LOGO,
  MANTLE_LOGO,
  OPTIMISM_LOGO,
  POLYGON_LOGO,
  USDC_LOGO,
  ALEPH_LOGO,
} from './logos';
import { Chain, Token, ChainToken } from './types';

export const NATIVE_COIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const CHAIN = {
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
  BASE: {
    ...base,
    shortName: 'Base',
    logo: BASE_LOGO,
  },
  ETHEREUM: {
    ...mainnet,
    shortName: 'Ethereum',
    logo: ETHEREUM_LOGO,
  },
  MANTLE: {
    ...mantle,
    shortName: 'Mantle',
    logo: MANTLE_LOGO,
  },
  OPTIMISM: {
    ...optimism,
    shortName: 'Optimism',
    logo: OPTIMISM_LOGO,
  },
  POLYGON: {
    ...polygon,
    shortName: 'Polygon',
    logo: POLYGON_LOGO,
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
  ECHELON_PRIME: {
    name: 'Echelon Prime',
    symbol: 'PRIME',
    logo: ECHELON_PRIME_LOGO,
  },
  AAVEGOTCHI: {
    name: 'Aavegotchi',
    symbol: 'GHST',
    logo: AAVEGOTCHI_LOGO,
  },
  DEGEN: { name: 'Degen', symbol: 'DEGEN', logo: DEGEN_LOGO },
  YGG: {
    name: 'Yield Guild Games',
    symbol: 'YGG',
    // logo: YGG_LOGO,
    logo: AAVEGOTCHI_LOGO,
  },
  PDT: {
    name: 'ParagonsDAO',
    symbol: 'PDT',
    // logo: PDT_LOGO,
    logo: AAVEGOTCHI_LOGO,
  },
} satisfies Record<string, Token>;

export const CHAIN_ID_TO_TOKENS = {
  [CHAIN.ALEPH.id]: [
    {
      ...TOKEN.USDC,
      name: 'USDC',
      decimals: 6,
      address: '0x4Ca4B85Ead5EA49892d3a81DbfAE2f5c2F75d53D',
    },
  ],
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
  ],
  [CHAIN.POLYGON.id]: [
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
  [CHAIN.MANTLE.id]: [
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
      ...TOKEN.PDT,
      decimals: 18,
      address: '0xeff2a458e464b07088bdb441c21a42ab4b61e07e',
    },
    {
      ...TOKEN.DEGEN,
      decimals: 18,
      address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    },
  ],
} satisfies Record<string, ChainToken[]>;

export const DEFAULT_ALLOWED_CHAINS_IDS = [
  CHAIN.ALEPH.id,
  CHAIN.BASE.id,
  CHAIN.ETHEREUM.id,
  CHAIN.MANTLE.id,
  CHAIN.OPTIMISM.id,
  CHAIN.POLYGON.id,
];

export const ERC20_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const TIPPING_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_maticUsdAggregator',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'innerError',
        type: 'bytes',
      },
    ],
    name: 'BatchError',
    type: 'error',
  },
  {
    inputs: [],
    name: 'tipping__withdraw__OnlyAdminCanWithdraw',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipientAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
    ],
    name: 'TipMessage',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MINIMAL_PAYMENT_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINIMAL_PAYMENT_FEE_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAYMENT_FEE_PERCENTAGE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAYMENT_FEE_PERCENTAGE_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAYMENT_FEE_SLIPPAGE_PERCENT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_adminAddress',
        type: 'address',
      },
    ],
    name: 'addAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'admins',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: '_calls',
        type: 'bytes[]',
      },
    ],
    name: 'batch',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minimalPaymentFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_paymentFeeDenominator',
        type: 'uint256',
      },
    ],
    name: 'changeMinimalPaymentFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_paymentFeePercentage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_paymentFeeDenominator',
        type: 'uint256',
      },
    ],
    name: 'changePaymentFeePercentage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_adminAddress',
        type: 'address',
      },
    ],
    name: 'deleteAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
      {
        internalType: 'enum AssetType',
        name: '_assetType',
        type: 'uint8',
      },
    ],
    name: 'getPaymentFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_assetId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_assetContractAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_message',
        type: 'string',
      },
    ],
    name: 'sendERC1155To',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_nftContractAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_message',
        type: 'string',
      },
    ],
    name: 'sendERC721To',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_message',
        type: 'string',
      },
    ],
    name: 'sendTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_tokenContractAddr',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_message',
        type: 'string',
      },
    ],
    name: 'sendTokenTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenContract',
        type: 'address',
      },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const CHAIN_TO_IDRISS_TIPPING_ADDRESS = {
  [CHAIN.POLYGON.id]: '0xe35B356ac2c880cCcc769bA9393F0748d94ABBCa',
  [CHAIN.ETHEREUM.id]: '0xe18036D7E3377801a19d5Db3f9b236617979674E',
  [CHAIN.OPTIMISM.id]: '0x43F532D678b6a1587BE989a50526F89428f68315',
  [CHAIN.BASE.id]: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  [CHAIN.MANTLE.id]: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  [CHAIN.ALEPH.id]: '0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4',
} as const;

export const EMPTY_HEX = '0x';
