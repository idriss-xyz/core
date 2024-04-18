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

export interface GetEthPriceResponse {
  price: string;
}
