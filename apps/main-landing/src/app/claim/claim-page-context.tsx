import { ReactNode, createContext, useState } from 'react';
import { createContextHook } from '@idriss-xyz/ui/utils';

import { CLAIM_PAGE_ROUTE, ClaimPageRoute } from './constants';
import { EligibilityCheckResponse } from './types';
import { Hex } from 'viem';

type Properties = {
  children: ReactNode;
};

type ClaimPageContextValues = {
  currentRoute: ClaimPageRoute;
  walletAddress: Hex | undefined;
  vestingPlan: VestingPlan | undefined;
  eligibilityData: EligibilityCheckResponse | undefined;
  navigate: (route: ClaimPageRoute) => void;
  setWalletAddress: (walletAddress: Hex) => void;
  setVestingPlan: (vestingPlan: VestingPlan) => void;
  setEligibilityData: (eligibilityData: EligibilityCheckResponse) => void;
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
  const [eligibilityData, setEligibilityData] =
    useState<EligibilityCheckResponse>();
  const [walletAddress, setWalletAddress] = useState<string>();

  const navigate = (route: ClaimPageRoute) => {
    setCurrentRoute(route);
  };

  return (
    <ClaimPageContext.Provider
      value={{
        vestingPlan,
        currentRoute,
        walletAddress,
        eligibilityData,
        navigate,
        setVestingPlan,
        setWalletAddress,
        setEligibilityData,
      }}
    >
      {children}
    </ClaimPageContext.Provider>
  );
};

export const useClaimPage = createContextHook(ClaimPageContext);
