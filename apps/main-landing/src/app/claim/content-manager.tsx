/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo } from 'react';
import { useAccount, useWalletClient, useDisconnect } from 'wagmi';
import { Button } from '@idriss-xyz/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { backgroundLines2 } from '@/assets';

import '@rainbow-me/rainbowkit/styles.css';
import idrissSceneStream from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import { useClaimPage } from './claim-page-context';
import { CheckEligibilityContent } from './components/check-eligibility/check-eligibility-content';
import { ClaimContent } from './components/claim/claim-content';
import { ClaimSuccessfulModal } from './components/claim/claim-successful-modal';
// import { VestingPlanContent } from './components/vesting-plan/vesting-plan-content';

export const ContentManager = () => {
  const { currentRoute } = useClaimPage();

  const { isConnected } = useAccount();

  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();
  const { connectModalOpen, openConnectModal } = useConnectModal();

  console.log('walletClient', walletClient);

  const routeContent = useMemo(() => {
    switch (currentRoute) {
      case '/check-eligibility': {
        return <CheckEligibilityContent />;
      }
      case '/claim': {
        return <ClaimContent />;
      }
      case '/claim-successful': {
        return <ClaimSuccessfulModal />;
      }
      case '/vesting-plans': {
        return <h1>{/* <VestingPlanContent /> */}</h1>;
      }
      default: {
        return <CheckEligibilityContent />;
      }
    }
  }, [currentRoute]);
  return (
    <main className="relative flex min-h-screen grow flex-col items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] lg:flex-row lg:items-start lg:justify-center lg:px-0">
      <img
        src={idrissSceneStream.src}
        className="pointer-events-none absolute left-[-310px] top-[-20px] z-1 h-[1440px] w-[2306.px] min-w-[120vw] max-w-none rotate-[25.903deg] lg:block"
        alt=""
      />
      <img
        src={backgroundLines2.src}
        className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
        alt=""
      />
      <div className="flex flex-col">
        {routeContent}
        {isConnected ? (
          <div className="relative z-10 flex w-full flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-5 backdrop-blur-[45px]">
            <span className="text-heading3 text-neutralGreen-700">
              All good, your wallet is connected!
            </span>
            <Button
              intent="secondary"
              size="small"
              className="w-full"
              onClick={() => {
                console.log('clicked');
                disconnect();
              }}
            >
              DISCONNECT WALLET
            </Button>
          </div>
        ) : (
          <Button
            intent="primary"
            size="medium"
            className="mt-6 w-full"
            onClick={openConnectModal}
            loading={connectModalOpen}
          >
            CONNECT WALLET
          </Button>
        )}
      </div>
    </main>
  );
};
