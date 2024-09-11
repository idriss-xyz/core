import { EIP1193Provider } from 'mipd';
import { Chain as ViemChain } from 'viem';

export type Hex = `0x${string}`;

// export interface Chain {
//   id: number;
//   name: string;
//   logo: string;
//   nativeCurrency: {
//     name: string;
//     symbol: string;
//     decimals: number;
//   };
//   rpcUrls: string[];
//   blockExplorerUrls: string[];
// }

export type Chain = ViemChain & { logo: string };
export interface Token {
  name: string;
  logo: string;
  symbol: string;
}

export interface ChainToken extends Token {
  decimals: number;
  address: Hex;
}

export interface GetEthPriceResponse {
  price: string;
}

export interface Wallet {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
  providerRdns: string;
}
