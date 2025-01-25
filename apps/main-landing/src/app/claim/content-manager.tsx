/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@idriss-xyz/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Steps } from '@idriss-xyz/ui/steps';

import { backgroundLines2 } from '@/assets';

import '@rainbow-me/rainbowkit/styles.css';
import idrissSceneStream from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import idrissCoinFalling from './assets/ID-Coin falling 2.png';
import { useClaimPage } from './claim-page-context';
import { CheckEligibilityContent } from './components/check-eligibility/check-eligibility-content';
import { ClaimContent } from './components/claim/claim-content';
import { VestingPlanContent } from './components/vesting-plan/vesting-plan-content';
import { ClaimSuccessfulContent } from './components/claim-successful/claim-successful-content';
import { claimSteps } from './constants';
import { LetterContent } from './components/letter/letter-content';
import { AboutIdrissContent } from './components/about-idriss/about-idriss-content';

export const ContentManager = () => {
  const { currentContent } = useClaimPage();
  const [videoError, setVideoError] = useState(false);

  const { isConnected } = useAccount();

  const { disconnect } = useDisconnect();
  const { connectModalOpen, openConnectModal } = useConnectModal();

  const activeStepIndex = useMemo(() => {
    if (currentContent === 'letter') {
      return 0;
    }

    if (currentContent === 'about-idriss') {
      return 1;
    }

    return 2;
  }, [currentContent]);

  const currentContentComponent = useMemo(() => {
    switch (currentContent) {
      case 'letter': {
        return <LetterContent />;
      }
      case 'about-idriss': {
        return <AboutIdrissContent />;
      }
      case 'check-eligibility': {
        return <CheckEligibilityContent />;
      }
      case 'claim': {
        return <ClaimContent />;
      }
      case 'claim-successful': {
        return <ClaimSuccessfulContent />;
      }
      case 'vesting-plans': {
        return <VestingPlanContent />;
      }
      default: {
        return <CheckEligibilityContent />;
      }
    }
  }, [currentContent]);
  return (
    <main className="relative flex min-h-screen grow flex-col items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] lg:flex-row lg:items-start lg:justify-center lg:px-0">
      {currentContent === 'claim-successful' ? (
        videoError ? (
          <img
            src={idrissCoinFalling.src}
            className="fixed inset-0 size-auto min-h-full min-w-full object-cover"
            alt="Falling coins animation fallback"
            loading="lazy"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="fixed inset-0 size-auto min-h-full min-w-full object-cover"
            onError={() => {
              return setVideoError(true);
            }}
          >
            <source src="/videos/coins-rain.mp4" type="video/mp4" />
          </video>
        )
      ) : (
        <>
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
        </>
      )}
      <div className="flex flex-col lg:mt-32 lg:[@media(max-height:800px)]:mt-[60px]">
        {currentContent !== 'claim-successful' && (
          <Steps
            steps={claimSteps}
            activeStepIndex={activeStepIndex}
            className="m-auto mb-[60px] w-[800px]"
          />
        )}
        {currentContentComponent}
        {isConnected ? (
          <div className="relative z-10 flex w-full flex-col items-center gap-2 rounded-2xl bg-[rgba(255,255,255,0.5)] px-5 py-3 backdrop-blur-[45px]">
            <span className="text-heading6 text-neutralGreen-700">
              All good, your wallet is connected!
            </span>
            <Button
              intent="secondary"
              size="small"
              className="w-full"
              onClick={() => {
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
