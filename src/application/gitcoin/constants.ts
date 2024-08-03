import { CHAIN } from 'shared/web3';

export const ACROSS_DONATION_MODIFIER = '1dc0de0012';

export const MIN_CROSS_CHAIN_DONATION_AMOUNT = 1;
export const MIN_DONATION_AMOUNT = 0.001;

export const OSS_ROUNDS = ['23', '25', '26', '27'];

export const WRAPPED_ETH_ADDRESS_PER_CHAIN_ID = {
  [CHAIN.BASE.id]: '0x4200000000000000000000000000000000000006',
  [CHAIN.LINEA.id]: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
  [CHAIN.OPTIMISM.id]: '0x4200000000000000000000000000000000000006',
  [CHAIN.ZK_SYNC_ERA.id]: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  [CHAIN.ARBITRUM_ONE.id]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [CHAIN.ETHEREUM.id]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
};

export const DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID = {
  [CHAIN.BASE.id]: '0x7960312ca63e291244d180E75A8A0AC4a18032F7',
  [CHAIN.LINEA.id]: '0x63c461A407FaE2E7F743B9be79A8DdF815D0F487',
  [CHAIN.OPTIMISM.id]: '0x0c51AE117e8e4028e653FA3Bd5ccBaB97861c045',
  [CHAIN.ZK_SYNC_ERA.id]: '0x13B73661A4B601f22346421c19Cf97628ba1FdCF',
  [CHAIN.ARBITRUM_ONE.id]: '0xF3D400cA68F79d27DDa6cc7B1E6fEf8b444FE016',
  [CHAIN.ETHEREUM.id]: '0x63c461A407FaE2E7F743B9be79A8DdF815D0F487',
} as const;

export const GITCOIN_DONATION_CHAINS_IDS = Object.keys(
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
).map(Number);

export const GET_ETH_PER_DOLLAR_COMMAND_DETAILS = {
  amount: 1_000_000,
  sellToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  buyToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  chainId: CHAIN.ETHEREUM.id,
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
  { inputs: [], name: 'EasAlreadySet', type: 'error' },
  { inputs: [], name: 'InvalidAmount', type: 'error' },
  { inputs: [], name: 'InvalidEAS', type: 'error' },
  { inputs: [], name: 'NoRoundOnDestination', type: 'error' },
  { inputs: [], name: 'OutputAmountZero', type: 'error' },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'donor',
        type: 'address',
      },
      { indexed: false, internalType: 'bytes', name: 'message', type: 'bytes' },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'roundId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'donor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'voteData',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Donate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'eas', type: 'address' },
    ],
    name: 'InitializeEAS',
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
  { anonymous: false, inputs: [], name: 'Withdraw', type: 'event' },
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
    inputs: [
      { internalType: 'address', name: 'eas', type: 'address' },
      { internalType: 'bytes32', name: 'easSchema', type: 'bytes32' },
    ],
    name: 'initializeEAS',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ internalType: 'bytes', name: 'encoded', type: 'bytes' }],
    name: 'verifyDonation',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
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

export const GITCOIN_ICON =
  'data:image/png;base64,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';
