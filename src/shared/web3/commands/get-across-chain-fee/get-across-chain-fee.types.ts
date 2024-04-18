export interface GetAcrossChainFeeChainConfig {
  id: number;
  wrappedEthAddress: string;
}

export interface GetAcrossChainFeeCommandDetails {
  chain: GetAcrossChainFeeChainConfig;
  destinationChainId: number;
  amount: string;
  message: string;
  recipient: string;
}

export interface GetAcrossChainFeeResponse {
  timestamp: string;
  totalRelayFee: {
    total: string;
  };
}
