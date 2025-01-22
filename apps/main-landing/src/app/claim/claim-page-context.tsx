import { ReactNode, createContext, useEffect, useState } from 'react';
import { createContextHook } from '@idriss-xyz/ui/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { CLAIM_PAGE_ROUTE, ClaimPageRoute } from './constants';
import { EligibilityCheckResponse } from './types';

type Properties = {
  children: ReactNode;
};

type ClaimPageContextValues = {
  currentRoute: ClaimPageRoute;
  eligibilityDataLoading: boolean;
  walletAddress: string | undefined;
  vestingPlan: VestingPlan | undefined;
  eligibilityData: EligibilityCheckResponse | undefined;
  navigate: (route: ClaimPageRoute) => void;
  setWalletAddress: (walletAddress: string) => void;
  setVestingPlan: (vestingPlan: VestingPlan) => void;
};

export type VestingPlan =
  | 'claim_50'
  | 'claim_and_stake_50'
  | 'claim_and_stake_100';
const ClaimPageContext = createContext<ClaimPageContextValues | undefined>(
  undefined,
);

export const ClaimPageProvider = ({ children }: Properties) => {
  const [currentRoute, setCurrentRoute] = useState<ClaimPageRoute>(
    CLAIM_PAGE_ROUTE.CHECK_ELIGIBILITY,
  );
  const [vestingPlan, setVestingPlan] = useState<VestingPlan>();
  const [walletAddress, setWalletAddress] = useState<string>();

  const eligibilityMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const { data } = await axios.get<EligibilityCheckResponse>(
        `https://api.idriss.xyz/check-eligibility/${walletAddress}`,
      );
      return data;
    },
  });

  const navigate = (route: ClaimPageRoute) => {
    setCurrentRoute(route);
  };

  useEffect(() => {
    if (walletAddress) {
      eligibilityMutation.mutate(walletAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return (
    <ClaimPageContext.Provider
      value={{
        vestingPlan,
        currentRoute,
        walletAddress,
        eligibilityData: eligibilityMutation.data,
        eligibilityDataLoading: eligibilityMutation.isPending,
        navigate,
        setVestingPlan,
        setWalletAddress,
      }}
    >
      {children}
    </ClaimPageContext.Provider>
  );
};

export const useClaimPage = createContextHook(ClaimPageContext);
