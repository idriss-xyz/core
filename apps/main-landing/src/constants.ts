import { Hex, parseAbi } from 'viem';

export const INTERNAL_LINK = {
  SUPERPOWERS: '/dao#apps',
  CREATORS: '/dao#creators',
  TOKEN: '/dao#token',
  EXPLORE: '/explore',
};

export const EXTERNAL_LINK = {
  VAULT: '/vault',
  TOP_CREATORS: '/ranking',
  TOP_DONORS: '/fan/ranking',
};

export const TOTAL_SUPPLY = 1_000_000_000n * 10n ** 18n;
export const VESTING_CONTRACT_ADDRESS =
  '0xf4937657ed8b3f3cb379eed47b8818ee947beb1e';
export const DAO_TREASURY_ADDRESS =
  '0x0186B0018082B35E53c084c9389659B8562ca956';
export const TEAM_TREASURY_ADDRESS =
  '0xECAe5326474144FeAc16c7Fc574107B0623ED3d6';
export const AIRDROP_TREASURY_ADDRESS =
  '0xADCFcC97cC9152f775197c3aD864E7A559C3BdB5';
export const POSITION_MANAGER = '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1';
export const POOL_ADDRESS = '0x6f9d09253f99d2b6843b5ec62c23496c37327216';

export const DAO_LIQUIDITY_ID = 1_722_849n;

export const UNISWAP_MINIMIZED_ABI = parseAbi([
  'function positions(uint256) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]);

export const POOL_ABI = parseAbi([
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)',
]);

const DATA_DIRECTORY_PATH = './data';
export const CLAIMED_EVENTS_FILE_PATH = `${DATA_DIRECTORY_PATH}/claimed-events.json`;
export const STAKED_EVENTS_FILE_PATH = `${DATA_DIRECTORY_PATH}/staked-withdrawn-events.json`;
export const STARTING_BLOCK_CLAIMED = 25_614_734n;

export interface ClaimEvent {
  to: Hex | undefined;
  total: string | undefined;
  bonus: boolean | undefined;
  transactionHash: Hex | undefined;
}
