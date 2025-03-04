/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import { Steps } from '@idriss-xyz/ui/steps';
import '@rainbow-me/rainbowkit/styles.css';

import { IDRISS_FALING_COINS, IDRISS_SCENE_STREAM } from '@/assets';

import { useClaimPage } from './claim-page-context';
import { CheckEligibilityContent } from './components/check-eligibility/check-eligibility-content';
import { ClaimContent } from './components/claim/claim-content';
import { VestingPlanContent } from './components/vesting-plan/vesting-plan-content';
import { ClaimSuccessfulContent } from './components/claim-successful/claim-successful-content';
import { claimSteps } from './constants';
import { LetterContent } from './components/letter/letter-content';
import { AboutIdrissContent } from './components/about-idriss/about-idriss-content';
import { NotEligibleContent } from './components/not-eligible/not-eligible-content';

export const DesktopContentManager = () => {
  const { currentContent } = useClaimPage();
  const [videoError, setVideoError] = useState(false);

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
      case 'not-eligible': {
        return <NotEligibleContent />;
      }
      default: {
        return <CheckEligibilityContent />;
      }
    }
  }, [currentContent]);

  return (
    <main className="relative hidden min-h-screen grow flex-col items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] lg:flex lg:flex-row lg:items-start lg:justify-center lg:px-0">
      {currentContent === 'claim-successful' ? (
        videoError ? (
          <img
            loading="lazy"
            src={IDRISS_FALING_COINS.src}
            alt="Falling coins animation fallback"
            className="fixed inset-0 size-auto min-h-full min-w-full object-cover"
          />
        ) : (
          <video
            loop
            muted
            autoPlay
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
            src={IDRISS_SCENE_STREAM.src}
            className="pointer-events-none absolute left-[-310px] top-[-20px] z-1 h-[1440px] w-[2306.px] min-w-[120vw] max-w-none rotate-[25.903deg] lg:block"
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

        <div className="hidden lg:block">{currentContentComponent}</div>
      </div>
    </main>
  );
};
