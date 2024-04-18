import { GetAcrossChainFeesCommandDetails } from './get-across-chain-fees.types';

export const getUseGetAcrossChainFeesQueryKey = (
  details: GetAcrossChainFeesCommandDetails,
) => {
  return [
    'getAcrossChainFees',
    details.amount,
    details.message,
    details.recipient,
    details.destinationChainId.toString(),
    ...details.chains.map((chain) => {
      return `${chain.id}-${chain.wrappedEthAddress}`;
    }),
  ];
};
