import { CHAIN } from 'shared/web3';
import { IDRISS_ICON, IDRISS_RED_ICON } from 'shared/idriss';

import { IconType } from './schema';

export const DEFAULT_ALLOWED_CHAINS_IDS = [
  CHAIN.POLYGON.id,
  CHAIN.ETHEREUM.id,
  CHAIN.ZK_SYNC_ERA.id,
  CHAIN.BASE.id,
  CHAIN.OPTIMISM.id,
  CHAIN.SCROLL.id,
  CHAIN.MANTLE.id,
  CHAIN.LINEA.id,
  CHAIN.BNB_CHAIN.id,
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
];

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
];

export const CHAIN_TO_IDRISS_TIPPING_ADDRESS = {
  [CHAIN.POLYGON.id]: '0xe35B356ac2c880cCcc769bA9393F0748d94ABBCa',
  [CHAIN.ETHEREUM.id]: '0xe18036D7E3377801a19d5Db3f9b236617979674E',
  [CHAIN.BNB_CHAIN.id]: '0xDffcE6D7a3C1ADa65aed49096b380B5b6814ffFd',
  [CHAIN.ZK_SYNC_ERA.id]: '0x6753D35A81d52C49485f5fbB93a059046D1f47a8',
  [CHAIN.LINEA.id]: '0x7Ef966A9F75Ae230F0583DCD24Ac689E47f533be',
  [CHAIN.OPTIMISM.id]: '0x43F532D678b6a1587BE989a50526F89428f68315',
  [CHAIN.BASE.id]: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  [CHAIN.MANTLE.id]: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  [CHAIN.SCROLL.id]: '0x324ad1738b9308d5af5e81edd6389bfa082a8968',
};

export const ICON_TYPE_TO_SRC: Record<IconType, string> = {
  redBadge: IDRISS_RED_ICON,
  default: IDRISS_ICON,
};

export const PUBLIC_ETH_TAG_NAME = 'Public ETH' as const;

export const WALLET_TAGS = [
  {
    tagName: PUBLIC_ETH_TAG_NAME,
    tagAddress:
      '9306eda974cb89b82c0f38ab407f55b6d124159d1fa7779f2e088b2b786573c1',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Metamask ETH',
    tagAddress:
      '5d181abc9dcb7e79ce50e93db97addc1caf9f369257f61585889870555f8c321',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Binance ETH',
    tagAddress:
      '4b118a4f0f3f149e641c6c43dd70283fcc07eacaa624efc762aa3843d85b2aba',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Coinbase ETH',
    tagAddress:
      '92c7f97fb58ddbcb06c0d5a7cb720d74bc3c3aa52a0d706e477562cba68eeb73',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Exchange ETH',
    tagAddress:
      'ec72020f224c088671cfd623235b59c239964a95542713390a2b6ba07dd1151c',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Private ETH',
    tagAddress:
      '005ba8fbc4c85a25534ac36354d779ef35e0ee31f4f8732b02b61c25ee406edb',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Essentials ETH',
    tagAddress:
      '3ea9415b82f0ee7db933aab0be377ee1c1a405969d8b8c2454bcce7372a161c2',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Rainbow ETH',
    tagAddress:
      '992335db5f54ef94a5f23be8b925ed2529b044537c19b59643d39696936b6d6c',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Argent ETH',
    tagAddress:
      '682614f9b037714bbf001db3a8d6e894fbdcf75cbbb9dea5a42edce33e880072',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Tally ETH',
    tagAddress:
      'f368de8673a59b860b71f54c7ba8ab17f0b9648ad014797e5f8d8fa9f7f1d11a',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Trust ETH',
    tagAddress:
      'df3d3f0233e396b2b27c3943269b10ecf2e7c1070a485e1b6b8f2201cb23cb52',
    coin: 'ETH',
    network: 'evm',
  },
  {
    tagName: 'Metamask BNB',
    tagAddress:
      '3bee8eefc6afe6b4f7dbcc024eb3ad4ceaa5e458d34b7877319f2fe9f676e983',
    coin: 'BNB',
    network: 'evm',
  },
  {
    tagName: 'Essentials BNB',
    tagAddress:
      '639c9abb5605a14a557957fa72e146e9abf727be32e5149dca377b647317ebb9',
    coin: 'BNB',
    network: 'evm',
  },
  {
    tagName: 'Metamask USDT',
    tagAddress:
      '74a3d8986c81769ed3bb99b773d66b60852f7ee3fa0d55a6a144523116c671c1',
    coin: 'USDT',
    network: 'evm',
  },
  {
    tagName: 'Binance USDT',
    tagAddress:
      '77c27c19cc85e24b1d4650800cc4b1bc607986dd3e78608435cececd31c35015',
    coin: 'USDT',
    network: 'evm',
  },
  {
    tagName: 'Coinbase USDT',
    tagAddress:
      'f2faabf9d133f31a13873ba8a15e676e063a730898ffadfcb0077f723260f563',
    coin: 'USDT',
    network: 'evm',
  },
  {
    tagName: 'Exchange USDT',
    tagAddress:
      '683e7b694b374ce0d81ba525361fa0c27fff7237eb12ec41b6e225449d5702b9',
    coin: 'USDT',
    network: 'evm',
  },
  {
    tagName: 'Private USDT',
    tagAddress:
      '8c9a306a7dc200c52d32e3c1fcbf2f65e8037a68127b81807e8e58428004bc57',
    coin: 'USDT',
    network: 'evm',
  },
  {
    tagName: 'Essentials USDT',
    tagAddress:
      '74dcb573a5c63382484f597ae8034a6153c011e291c01eb3da40e9d83c436a9a',
    coin: 'USDT',
    network: 'evm',
  },
  {
    tagName: 'Metamask USDC',
    tagAddress:
      '6f763fea691b1a723ef116e98c02fae07a4397e1a2b4b4c749d06845fa2ff5e4',
    coin: 'USDC',
    network: 'evm',
  },
  {
    tagName: 'Binance USDC',
    tagAddress:
      '7d2b0e0ee27a341da84ce56e95eb557988f9d4ff95fe452297fc765265bb27a2',
    coin: 'USDC',
    network: 'evm',
  },
  {
    tagName: 'Coinbase USDC',
    tagAddress:
      '6fe7c1a2fdd154e0b35283598724adee9a5d3b2e6523787d8b6de7cd441f15ca',
    coin: 'USDC',
    network: 'evm',
  },
  {
    tagName: 'Exchange USDC',
    tagAddress:
      '8c4a231c47a4cfa7530ba4361b6926da4acd87f569167b8ba55b268bf99640d0',
    coin: 'USDC',
    network: 'evm',
  },
  {
    tagName: 'Private USDC',
    tagAddress:
      '54c9da06ab3d7c6c7f813f36491b22b7f312ae8f3b8d12866d35b5d325895e3e',
    coin: 'USDC',
    network: 'evm',
  },
  {
    tagName: 'Essentials USDC',
    tagAddress:
      '23a66df178daf25111083ee1610fb253baf3d12bd74c6c2aae96077558e3737a',
    coin: 'USDC',
    network: 'evm',
  },
  {
    tagName: 'Essentials ELA SC',
    tagAddress:
      'c17c556467fe7c9fe5667dde7ca8cdbca8a24d0473b9e9c1c2c8166c1f355f6c',
    coin: 'ELA',
    network: 'evm',
  },
  {
    tagName: 'Essentials MATIC',
    tagAddress:
      '336fb6cdd7fec196c6e66966bd1c326072538a94e700b8bc1111d1574b8357ba',
    coin: 'MATIC',
    network: 'evm',
  },
  {
    tagName: 'ERC20',
    tagAddress:
      '63d95e64e7caff988f97fdf32de5f16624f971149749c90fbc7bbe44244d3ced',
    coin: 'ERC20',
    network: 'evm',
  },
] as const;
