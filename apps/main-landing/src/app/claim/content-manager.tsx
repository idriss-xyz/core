/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo } from 'react';

import { backgroundLines2 } from '@/assets';

import idrissSceneStream from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import { useClaimPage } from './claim-page-context';
import { CheckEligibilityContent } from './components/check-eligibility/check-eligibility-content';
import { ClaimContent } from './components/claim/claim-content';
import { ClaimSuccessfulModal } from './components/claim/claim-successful-modal';

export const ContentManager = () => {
  const { currentRoute } = useClaimPage();

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
        return <h2>Coming Soon...</h2>;
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
      {routeContent}
    </main>
  );
};
