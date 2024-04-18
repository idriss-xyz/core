export interface GetAcrossChainFeesChainConfig {
  id: number;
  wrappedEthAddress: string;
}

export interface GetAcrossChainFeesCommandDetails {
  chains: GetAcrossChainFeesChainConfig[];
  destinationChainId: number;
  amount: string;
  message: string;
  recipient: string;
}

export interface GetAcrossChainFeesResponse {
  totalRelayFee: {
    total: string;
  };
}
