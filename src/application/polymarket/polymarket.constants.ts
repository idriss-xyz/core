export const POLYMARKET_WEBSITE = 'https://polymarket.com' as const;
export const POLYMARKET_CLOB_API = 'https://clob.polymarket.com' as const;
export const POLYMARKET_GNOSIS_SAFE_SIGNATURE = 2;

export const OUTCOME = {
  YES: 'Yes',
  NO: 'No',
} as const;

export const EMPTY_TOKEN = {
  outcome: OUTCOME.YES,
  token_id: '',
} as const;

export const POLYMARKET_CONDITIONAL_TOKENS_CONTRACT_ADDRESS =
  '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045';

export const SAFE_USDC_ADDRES = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

export const ERC_20_ABI = [
  'function name() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
] as const;

export const EMPTY_MARKET_FORM = {
  amount: 0,
  selectedTokenId: '',
} as const;
