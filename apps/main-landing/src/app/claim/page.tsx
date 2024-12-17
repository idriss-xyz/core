'use client';
import Image from 'next/image';
import { Providers } from './providers';
import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';
import { Button } from '@idriss-xyz/ui/button';
import idrissCoin from './IDRISS_COIN 1.png';
import idrissSceneStream from './IDRISS_SCENE_STREAM_4_2 1.png';

export default function Claim() {
  return (
    <Providers>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <Image
          priority
          src={idrissSceneStream}
          className="pointer-events-none absolute z-1 lg:block"
          alt=""
        />
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />
        <div className="z-10 inline-flex flex-col items-center gap-4 overflow-hidden px-4 pb-3 pt-6 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-display2 gradient-text">COMMUNITY AIRDROP</h1>
            <span className="text-body2 text-neutralGreen-900 opacity-70">
              Check your eligibility and claim $IDRISS
            </span>
          </div>
          <div className="flex w-full flex-col items-center gap-10 rounded-[36px] border border-[rgba(145,206,154,0.5)] bg-[rgba(255,255,255,0.5)] p-[40px_40px_60px_40px] backdrop-blur-[45px]">
            <img className="size-[136px]" src={idrissCoin.src} />
            <div className="flex w-full flex-col items-center gap-2 rounded-[16px] border border-[var(--gradient-light-radial,#E7F5E7)] bg-[rgba(255,255,255,0.2)] px-10 py-8">
              <span className="text-body3 text-neutralGreen-700">
                CLAIM UNTIL
              </span>
              <span className="text-heading3 gradient-text">
                Monday, 24th March
              </span>
            </div>
            <Button
              intent="primary"
              size="large"
              isExternal
              suffixIconName="ArrowRight"
              asLink
            >
              CHECK MY ELIGIBILITY
            </Button>
          </div>
        </div>
      </main>
    </Providers>
  );
}
