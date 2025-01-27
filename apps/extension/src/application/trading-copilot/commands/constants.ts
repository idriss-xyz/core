export const COPILOT_API_URL = 'https://copilot-api.idriss.xyz';

export const ERC_20_ABI = [
  'function name() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function symbol() view returns (string)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
] as const;

export const FREE_SUBSCRIPTIONS = 10;

export const PREMIUM_THRESHOLD = 10_000;

export const IDRISS_CONTRACT = '0x000096630066820566162C94874A776532705231';
