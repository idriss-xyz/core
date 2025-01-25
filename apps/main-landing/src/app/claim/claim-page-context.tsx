import { ReactNode, createContext, useState } from 'react';
import { createContextHook } from '@idriss-xyz/ui/utils';

import { CLAIM_CONTENT, ClaimPageContent } from './constants';
import { EligibilityCheckResponse } from './types';

type Properties = {
  children: ReactNode;
};

type ClaimPageContextValues = {
  currentContent: ClaimPageContent;
  walletAddress: string | undefined;
  vestingPlan: VestingPlan | undefined;
  eligibilityData: EligibilityCheckResponse | undefined;
  setCurrentContent: (currentContent: ClaimPageContent) => void;
  setWalletAddress: (walletAddress: string) => void;
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
  const [currentContent, setCurrentContent] = useState<ClaimPageContent>(
    CLAIM_CONTENT.LETTER,
  );
  const [vestingPlan, setVestingPlan] = useState<VestingPlan>();
  const [eligibilityData, setEligibilityData] =
    useState<EligibilityCheckResponse>();
  const [walletAddress, setWalletAddress] = useState<string>();

  return (
    <ClaimPageContext.Provider
      value={{
        vestingPlan,
        walletAddress,
        currentContent,
        eligibilityData,
        setVestingPlan,
        setWalletAddress,
        setCurrentContent,
        setEligibilityData,
      }}
    >
      {children}
    </ClaimPageContext.Provider>
  );
};

export const useClaimPage = createContextHook(ClaimPageContext);
