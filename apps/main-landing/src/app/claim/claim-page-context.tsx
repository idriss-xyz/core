import { ReactNode, createContext, useState } from 'react';
import { createContextHook } from '@idriss-xyz/ui/utils';
import { Hex } from 'viem';

import { CLAIM_CONTENT, ClaimPageContent } from './constants';
import { EligibilityCheckResponse, VestingPlan } from './types';

type Properties = {
  children: ReactNode;
};

type ClaimPageContextValues = {
  currentContent: ClaimPageContent;
  walletAddress: Hex | undefined;
  vestingPlan: VestingPlan | undefined;
  eligibilityData: EligibilityCheckResponse | undefined;
  hasAlreadyClaimed: boolean;
  setCurrentContent: (currentContent: ClaimPageContent) => void;
  setWalletAddress: (walletAddress: Hex) => void;
  setVestingPlan: (vestingPlan: VestingPlan) => void;
  setEligibilityData: (eligibilityData: EligibilityCheckResponse) => void;
  setHasAlreadyClaimed: (hasAlreadyClaimed: boolean) => void;
};

const ClaimPageContext = createContext<ClaimPageContextValues | undefined>(
  undefined,
);

export const ClaimPageProvider = ({ children }: Properties) => {
  const [currentContent, setCurrentContent] = useState<ClaimPageContent>(
    CLAIM_CONTENT.CLAIM,
  );
  const [vestingPlan, setVestingPlan] = useState<VestingPlan>();
  const [eligibilityData, setEligibilityData] =
    useState<EligibilityCheckResponse>();
  const [walletAddress, setWalletAddress] = useState<Hex>();
  const [hasAlreadyClaimed, setHasAlreadyClaimed] = useState(false);

  return (
    <ClaimPageContext.Provider
      value={{
        vestingPlan,
        walletAddress,
        currentContent,
        eligibilityData,
        hasAlreadyClaimed,
        setVestingPlan,
        setWalletAddress,
        setCurrentContent,
        setEligibilityData,
        setHasAlreadyClaimed,
      }}
    >
      {children}
    </ClaimPageContext.Provider>
  );
};

export const useClaimPage = createContextHook(ClaimPageContext);
