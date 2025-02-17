import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Hex } from 'viem';

import { EligibilityCheckResponse } from '@/app/claim/types';

type Payload = {
  address: Hex;
};

const checkEligibility = async (payload: Payload) => {
  const { data: eligibility } = await axios.get<EligibilityCheckResponse>(
    `https://api.idriss.xyz/check-eligibility/${payload.address}`,
  );

  return eligibility;
};

export const useCheckEligibility = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await checkEligibility({ address: payload.address });
    },
  });
};
