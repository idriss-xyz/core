import {
  BANKLESS_DAO_LOGO,
  BNB_TOKEN_LOGO,
  CULT_DAO_LOGO,
  DOGECOIN_LOGO,
  HIGHER_LOGO,
  MANTLE_LOGO,
  MOXIE_LOGO,
  OPTIMISM_LOGO,
  POLYGON_LOGO,
  RVLT_LOGO,
  WETH_LOGO,
  ALEPH_LOGO,
  // PIXELS_LOGO,
  NATIVE_COIN_ADDRESS,
  CHAIN as SHARED_CHAIN,
  TOKEN as SHARED_TOKEN,
  Chain,
  Token,
  ChainToken,
  CELO_LOGO,
  CUSD_LOGO,
} from '@idriss-xyz/constants';

export const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NATIVE_SOL_ADDRESS = '11111111111111111111111111111111';

// TODO: IMPORTANT CHECK SHORTNAMES
export const CHAIN = Object.assign(SHARED_CHAIN, {}) satisfies Record<
  string,
  Chain
>;

export const TOKEN = Object.assign(SHARED_TOKEN, {
  CELO: {
    name: 'Celo',
    symbol: 'CELO',
    logo: CELO_LOGO,
  },
  CUSD: {
    name: 'Celo Dollar',
    symbol: 'CUSD',
    logo: CUSD_LOGO,
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
  OPTIMISM: { name: 'Optimism', symbol: 'OP', logo: OPTIMISM_LOGO },
  BNB: { name: 'BNB', symbol: 'BNB', logo: BNB_TOKEN_LOGO },
  WETH: { name: 'WETH', symbol: 'WETH', logo: WETH_LOGO },
  DOGECOIN: { name: 'Dogecoin', symbol: 'DOGE', logo: DOGECOIN_LOGO },
  POLYGON: {
    name: 'Polygon',
    symbol: 'POL',
    logo: POLYGON_LOGO,
  },
  REVOLT2EARN: { name: 'Revolt 2 Earn', symbol: 'RVLT', logo: RVLT_LOGO },
  MANTLE: { name: 'Mantle', symbol: 'MNT', logo: MANTLE_LOGO },
  AZERO: { name: 'Aleph Zero', symbol: 'AZERO', logo: ALEPH_LOGO },
  HIGHER: { name: 'Higher', symbol: 'HIGHER', logo: HIGHER_LOGO },
  // PIXEL: {
  //   name: 'Pixels',
  //   symbol: 'PIXEL',
  //   logo: PIXELS_LOGO,
  // },
  MOXIE: { name: 'Moxie', symbol: 'MOXIE', logo: MOXIE_LOGO },
}) satisfies Record<string, Token>;

export const CHAIN_ID_TO_TOKENS = {
  [CHAIN.ABSTRACT.id]: [
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
  [CHAIN.CELO.id]: [
    {
      ...TOKEN.CELO,
      decimals: 18,
      address: NATIVE_COIN_ADDRESS,
    },
    {
      ...TOKEN.USDC,
      decimals: 6,
      address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    },
    {
      ...TOKEN.CUSD,
      decimals: 18,
      address: '0x765de816845861e75a25fca122bb6898b8b1282a',
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
    {
      ...TOKEN.WETH,
      decimals: 18,
      name: 'ETH on Polygon',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
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
  [CHAIN.RONIN.id]: [
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
      ...TOKEN.IDRISS,
      decimals: 18,
      address: '0x000096630066820566162c94874a776532705231',
    },
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
      ...TOKEN.HIGHER,
      decimals: 18,
      address: '0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe',
    },
    {
      ...TOKEN.MOXIE,
      decimals: 18,
      address: '0x8c9037d1ef5c6d1f6816278c7aaf5491d24cd527',
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
