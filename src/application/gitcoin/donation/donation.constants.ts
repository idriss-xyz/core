import { CHAIN } from 'shared/web3';

export const MIN_CROSS_CHAIN_DONATION_AMOUNT = 1;
export const MIN_DONATION_AMOUNT = 0.001;

export const OSS_ROUNDS = ['23', '25', '26', '27'];
export const GITCOIN_DONATION_CHAINS_IDS: number[] = [
  CHAIN.ARBITRUM_ONE.id,
  CHAIN.ZK_SYNC_ERA.id,
  CHAIN.LINEA.id,
  CHAIN.BASE.id,
  CHAIN.OPTIMISM.id,
  CHAIN.ETHEREUM.id,
];

export const WRAPPED_ETH_ADDRESS_PER_CHAIN_ID = {
  [CHAIN.BASE.id]: '0x4200000000000000000000000000000000000006',
  [CHAIN.LINEA.id]: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
  [CHAIN.OPTIMISM.id]: '0x4200000000000000000000000000000000000006',
  [CHAIN.ZK_SYNC_ERA.id]: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  [CHAIN.ARBITRUM_ONE.id]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [CHAIN.ETHEREUM.id]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
};

export const DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID = {
  [CHAIN.BASE.id]: '0x51C2DDC09B67aB9152ACFB6a9a5E7A8DB1485ae8',
  [CHAIN.LINEA.id]: '0xcbf32F0a9BF93256BAD8cD31cF37a3e914245908',
  [CHAIN.OPTIMISM.id]: '0xd82BDb8391109f8BaD393Ff2CDa9E7Cd56F8239C',
  [CHAIN.ZK_SYNC_ERA.id]: '0x8F5fc20f5a3e69B7DCc5AC477dCC4484C64897dA',
  [CHAIN.ARBITRUM_ONE.id]: '0xaA098E5c9B002F815d7c9756BCfce0fC18B3F362',
  [CHAIN.ETHEREUM.id]: '0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4',
};

export const GET_ETH_PRICE_COMMAND_DETAILS = {
  amount: 1_000_000,
  sellToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  buyToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
};

export const SMALLEST_AMOUNT_MESSAGE_PER_CHAIN_ID = {
  [CHAIN.ARBITRUM_ONE.id]:
    '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000022000000000000000000000000974fdbc4ff3ae73ceeba5b4c85521f2638ee54e500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f8590ccb6c0d7069f61e397beeb7c0f931b6fc0d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000c3e893270000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041138a90ae0915d9deecb8592791d3e30b6294c941b60039dbbc2568910bbe73682015e01ffd65ca386c6d9fed3ab18a87928a615bf37af8feb9952f47a3189b001b00000000000000000000000000000000000000000000000000000000000000',
  [CHAIN.OPTIMISM.id]:
    '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000013000000000000000000000000974fdbc4ff3ae73ceeba5b4c85521f2638ee54e500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f8590ccb6c0d7069f61e397beeb7c0f931b6fc0d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000c6e7c4810000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041e75f93f39aa6140aea4c177f9f23457c81d6b6c01fea3a3e48e81a05e0c0ce001e651b1281f5e0df21aa1ca749314803d77aadb84744c922c23150645fd7afd11b00000000000000000000000000000000000000000000000000000000000000',
};

export const ALLO_CONTRACT_ADDRESS =
  '0x1133eA7Af70876e64665ecD07C0A0476d09465a1';

export const ALLO_CONTRACT_ABI = [
  { inputs: [], name: 'ALLOCATION_ACTIVE', type: 'error' },
  { inputs: [], name: 'ALLOCATION_NOT_ACTIVE', type: 'error' },
  { inputs: [], name: 'ALLOCATION_NOT_ENDED', type: 'error' },
  { inputs: [], name: 'ALREADY_INITIALIZED', type: 'error' },
  { inputs: [], name: 'AMOUNT_MISMATCH', type: 'error' },
  { inputs: [], name: 'ANCHOR_ERROR', type: 'error' },
  { inputs: [], name: 'ARRAY_MISMATCH', type: 'error' },
  { inputs: [], name: 'INVALID', type: 'error' },
  { inputs: [], name: 'INVALID_ADDRESS', type: 'error' },
  { inputs: [], name: 'INVALID_FEE', type: 'error' },
  { inputs: [], name: 'INVALID_METADATA', type: 'error' },
  { inputs: [], name: 'INVALID_REGISTRATION', type: 'error' },
  { inputs: [], name: 'IS_APPROVED_STRATEGY', type: 'error' },
  { inputs: [], name: 'MISMATCH', type: 'error' },
  { inputs: [], name: 'NONCE_NOT_AVAILABLE', type: 'error' },
  { inputs: [], name: 'NOT_APPROVED_STRATEGY', type: 'error' },
  { inputs: [], name: 'NOT_ENOUGH_FUNDS', type: 'error' },
  { inputs: [], name: 'NOT_INITIALIZED', type: 'error' },
  { inputs: [], name: 'NOT_PENDING_OWNER', type: 'error' },
  { inputs: [], name: 'NewOwnerIsZeroAddress', type: 'error' },
  { inputs: [], name: 'NoHandoverRequest', type: 'error' },
  { inputs: [], name: 'POOL_ACTIVE', type: 'error' },
  { inputs: [], name: 'POOL_INACTIVE', type: 'error' },
  { inputs: [], name: 'RECIPIENT_ALREADY_ACCEPTED', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'recipientId', type: 'address' }],
    name: 'RECIPIENT_ERROR',
    type: 'error',
  },
  { inputs: [], name: 'RECIPIENT_NOT_ACCEPTED', type: 'error' },
  { inputs: [], name: 'REGISTRATION_NOT_ACTIVE', type: 'error' },
  { inputs: [], name: 'UNAUTHORIZED', type: 'error' },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  { inputs: [], name: 'ZERO_ADDRESS', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'BaseFeePaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'baseFee',
        type: 'uint256',
      },
    ],
    name: 'BaseFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'pendingOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipHandoverCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'pendingOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipHandoverRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldOwner',
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
        indexed: false,
        internalType: 'uint256',
        name: 'percentFee',
        type: 'uint256',
      },
    ],
    name: 'PercentFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'profileId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'contract IStrategy',
        name: 'strategy',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        components: [
          { internalType: 'uint256', name: 'protocol', type: 'uint256' },
          { internalType: 'string', name: 'pointer', type: 'string' },
        ],
        indexed: false,
        internalType: 'struct Metadata',
        name: 'metadata',
        type: 'tuple',
      },
    ],
    name: 'PoolCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
    ],
    name: 'PoolFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        components: [
          { internalType: 'uint256', name: 'protocol', type: 'uint256' },
          { internalType: 'string', name: 'pointer', type: 'string' },
        ],
        indexed: false,
        internalType: 'struct Metadata',
        name: 'metadata',
        type: 'tuple',
      },
    ],
    name: 'PoolMetadataUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'registry',
        type: 'address',
      },
    ],
    name: 'RegistryUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'strategy',
        type: 'address',
      },
    ],
    name: 'StrategyApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'strategy',
        type: 'address',
      },
    ],
    name: 'StrategyRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'treasury',
        type: 'address',
      },
    ],
    name: 'TreasuryUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NATIVE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'address', name: '_manager', type: 'address' },
    ],
    name: 'addPoolManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
    name: 'addToCloneableStrategies',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'allocate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: '_poolIds', type: 'uint256[]' },
      { internalType: 'bytes[]', name: '_datas', type: 'bytes[]' },
    ],
    name: 'batchAllocate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: '_poolIds', type: 'uint256[]' },
      { internalType: 'bytes[]', name: '_data', type: 'bytes[]' },
    ],
    name: 'batchRegisterRecipient',
    outputs: [
      { internalType: 'address[]', name: 'recipientIds', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'pendingOwner', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_profileId', type: 'bytes32' },
      { internalType: 'address', name: '_strategy', type: 'address' },
      { internalType: 'bytes', name: '_initStrategyData', type: 'bytes' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'protocol', type: 'uint256' },
          { internalType: 'string', name: 'pointer', type: 'string' },
        ],
        internalType: 'struct Metadata',
        name: '_metadata',
        type: 'tuple',
      },
      { internalType: 'address[]', name: '_managers', type: 'address[]' },
    ],
    name: 'createPool',
    outputs: [{ internalType: 'uint256', name: 'poolId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_profileId', type: 'bytes32' },
      { internalType: 'address', name: '_strategy', type: 'address' },
      { internalType: 'bytes', name: '_initStrategyData', type: 'bytes' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'protocol', type: 'uint256' },
          { internalType: 'string', name: 'pointer', type: 'string' },
        ],
        internalType: 'struct Metadata',
        name: '_metadata',
        type: 'tuple',
      },
      { internalType: 'address[]', name: '_managers', type: 'address[]' },
    ],
    name: 'createPoolWithCustomStrategy',
    outputs: [{ internalType: 'uint256', name: 'poolId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'address[]', name: '_recipientIds', type: 'address[]' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'fundPool',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBaseFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFeeDenominator',
    outputs: [
      { internalType: 'uint256', name: 'FEE_DENOMINATOR', type: 'uint256' },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPercentFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_poolId', type: 'uint256' }],
    name: 'getPool',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'profileId', type: 'bytes32' },
          {
            internalType: 'contract IStrategy',
            name: 'strategy',
            type: 'address',
          },
          { internalType: 'address', name: 'token', type: 'address' },
          {
            components: [
              { internalType: 'uint256', name: 'protocol', type: 'uint256' },
              { internalType: 'string', name: 'pointer', type: 'string' },
            ],
            internalType: 'struct Metadata',
            name: 'metadata',
            type: 'tuple',
          },
          { internalType: 'bytes32', name: 'managerRole', type: 'bytes32' },
          { internalType: 'bytes32', name: 'adminRole', type: 'bytes32' },
        ],
        internalType: 'struct IAllo.Pool',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRegistry',
    outputs: [
      { internalType: 'contract IRegistry', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_poolId', type: 'uint256' }],
    name: 'getStrategy',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTreasury',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_owner', type: 'address' },
      { internalType: 'address', name: '_registry', type: 'address' },
      { internalType: 'address payable', name: '_treasury', type: 'address' },
      { internalType: 'uint256', name: '_percentFee', type: 'uint256' },
      { internalType: 'uint256', name: '_baseFee', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
    name: 'isCloneableStrategy',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'address', name: '_address', type: 'address' },
    ],
    name: 'isPoolAdmin',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'address', name: '_address', type: 'address' },
    ],
    name: 'isPoolManager',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: 'result', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'pendingOwner', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_recipient', type: 'address' },
    ],
    name: 'recoverFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'registerRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
    name: 'removeFromCloneableStrategies',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      { internalType: 'address', name: '_manager', type: 'address' },
    ],
    name: 'removePoolManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_baseFee', type: 'uint256' }],
    name: 'updateBaseFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_percentFee', type: 'uint256' }],
    name: 'updatePercentFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_poolId', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'protocol', type: 'uint256' },
          { internalType: 'string', name: 'pointer', type: 'string' },
        ],
        internalType: 'struct Metadata',
        name: '_metadata',
        type: 'tuple',
      },
    ],
    name: 'updatePoolMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_registry', type: 'address' }],
    name: 'updateRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address payable', name: '_treasury', type: 'address' },
    ],
    name: 'updateTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const DONATION_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_eas', type: 'address' },
      { internalType: 'bytes32', name: '_easSchema', type: 'bytes32' },
      { internalType: 'address', name: '_acrossSpokePool', type: 'address' },
      { internalType: 'address', name: '_allo', type: 'address' },
      { internalType: 'address', name: '_wethAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'InsufficientFunds', type: 'error' },
  { inputs: [], name: 'InvalidEAS', type: 'error' },
  { inputs: [], name: 'NoRoundOnDestination', type: 'error' },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'Logger',
    type: 'event',
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
    inputs: [],
    name: 'ALLO_ADDRESS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EAS_SCHEMA',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NATIVE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SPOKE_POOL',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WETH_ADDRESS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'inputToken', type: 'address' },
          { internalType: 'address', name: 'outputToken', type: 'address' },
          { internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'destinationChainId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'exclusiveRelayer',
            type: 'address',
          },
          { internalType: 'uint32', name: 'quoteTimestamp', type: 'uint32' },
          { internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
          {
            internalType: 'uint32',
            name: 'exclusivityDeadline',
            type: 'uint32',
          },
        ],
        internalType: 'struct DonationWrapper.DepositParams',
        name: 'params',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'message', type: 'bytes' },
    ],
    name: 'callDepositV3',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_messageHash', type: 'bytes32' },
    ],
    name: 'getEthSignedMessageHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '_message', type: 'bytes' }],
    name: 'getMessageHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenSent', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'relayer', type: 'address' },
      { internalType: 'bytes', name: 'message', type: 'bytes' },
    ],
    name: 'handleV3AcrossMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'permit2',
    outputs: [
      {
        internalType: 'contract ISignatureTransfer',
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
        internalType: 'bytes32',
        name: '_ethSignedMessageHash',
        type: 'bytes32',
      },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
    ],
    name: 'recoverSigner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'sig', type: 'bytes' }],
    name: 'splitSignature',
    outputs: [
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'unwrapWETH',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_signer', type: 'address' },
      { internalType: 'bytes', name: '_message', type: 'bytes' },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
    ],
    name: 'verify',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'donationData', type: 'bytes' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'verifyDonation',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
