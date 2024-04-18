import { GetTokenPriceCommandDetails } from './get-token-price.types';

export const getUseGetTokenPriceQueryKey = (
  details: GetTokenPriceCommandDetails,
) => {
  return [
    'getTokenPrice',
    details.buyToken,
    details.sellToken,
    details.amount.toString(),
  ];
};
