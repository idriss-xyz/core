import { WalletClient } from 'viem';
import { WriteContractMutateAsync } from 'wagmi/query';
import { Config } from 'wagmi';

export type StakePayload = {
  amount: number;
};

export type UnstakePayload = {
  amount: number;
};

export type ApproveTokensPayload = {
  tokensToSend: bigint;
  walletClient: WalletClient;
  writeContractAsync: WriteContractMutateAsync<Config, unknown>;
};

export type TxLoadingHeadingParameters = {
  amount: number;
  action: string;
};
