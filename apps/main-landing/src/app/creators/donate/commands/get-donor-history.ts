import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { DonorHistoryResponse } from '@/app/creators/donate/types';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const LOCAL_API = 'http://localhost:4000';

const getDonorHistory = async (payload: Payload) => {
  const response = await fetch(`${LOCAL_API}/donor-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  // return {
  //   leaderboard: [
  //     {
  //       address: '0x42d4cb836571e60ffc84a6cdbeaa2f0d2240c2bd',
  //       totalAmount: 10_000,
  //       donorMetadata: {
  //         address: '0x42d4cb836571e60ffc84a6cdbeaa2f0d2240c2bd',
  //       },
  //     },
  //     ...result.leaderboard,
  //   ],
  //   stats: {
  //     totalDonationAmount: 1237,
  //     totalDonationsCount: 20,
  //     mostDonatedToAddress: '0x42d4cb836571e60ffc84a6cdbeaa2f0d2240c2bd',
  //     biggestDonationAmount: 1000,
  //     favoriteDonationToken: 'ETH',
  //     donorDisplayName: 'Levertzz',
  //     positionInLeaderboard: 1,
  //     favoriteTokenMetadata: {
  //       symbol: 'ETH',
  //       imageUrlV2:
  //         'https://storage.googleapis.com/zapper-fi-assets/tokens/base/0x0000000000000000000000000000000000000000.png',
  //       onchainMarketData: {
  //         price: 2306.0484,
  //       },
  //       address: '0x0000000000000000000000000000000000000000',
  //       decimals: 18,
  //     },
  //   },
  // };

  return result as DonorHistoryResponse;
};

export const useGetDonorHistory = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['donorHistory', payload.address],
    queryFn: () => {
      return getDonorHistory({ address: payload.address });
    },
    ...options,
  });
};
