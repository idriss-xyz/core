import { TypedDataDomain, TypedDataField } from 'ethers';
import { EIP1193Provider } from 'mipd';

export type Hex = `0x${string}`;

export interface Chain {
  id: number;
  name: string;
  logo: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

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

// type taken from ethers@5
type SignMethod = (
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: Record<string, any>,
) => Promise<string>;

export interface AnySigner {
  _signTypedData: SignMethod;
}
