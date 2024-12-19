'use client';
import Image from 'next/image';
import { Providers } from './providers';
import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';
import { Button } from '@idriss-xyz/ui/button';
import idrissCoin from './assets/IDRISS_COIN 1.png';
import idrissSceneStream from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { CopyAddressButton } from './components/copy-address-button';
import { ExpandableInfo } from './components/expandable-info';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { useState } from 'react';

export default function CheckEligibility() {
  const [termsChecked, setTermsChecked] = useState(false);
  return (
    <Providers>
      <TopBar />

      <main className="relative flex min-h-screen grow flex-col items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <img
          src={idrissSceneStream.src}
          className="pointer-events-none absolute left-[-310px] top-[-20px] z-1 h-[1440px] w-[2306.px] min-w-[120vw] max-w-none rotate-[25.903deg] lg:block"
        ></img>
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="z-10 inline-flex flex-col items-center gap-[78px] overflow-hidden px-4 pb-3 lg:mt-[78px] lg:[@media(max-height:800px)]:mt-[60px]">
          <img className="size-[137px]" src={idrissCoin.src} />
          <div className="relative flex flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-[40px_40px_60px_40px] backdrop-blur-[45px]">
            <GradientBorder
              gradientDirection="toTop"
              gradientStopColor="rgba(145, 206, 154, 0.50)"
              borderWidth={1}
            />
            <div className="flex w-[459px] flex-col">
              <div className="flex flex-col items-start gap-10">
                <span className="text-heading3">YOU’RE ELIGIBLE</span>
                <span className="text-body3 text-neutralGreen-700">
                  YOU WILL RECEIVE
                </span>
              </div>

              <div className="relative mb-10 mt-2 flex w-full flex-col items-start gap-2 self-stretch rounded-[25px] bg-[rgba(255,255,255,0.2)] p-6">
                <GradientBorder
                  gradientDirection="toBottom"
                  gradientStopColor="rgba(145, 206, 154)"
                  gradientStartColor="#ffffff"
                  borderWidth={1}
                />
                <span className="flex text-heading2 gradient-text">
                  1,250.0 $IDRISS
                </span>
                <div className="flex flex-row gap-2">
                  <CopyAddressButton />
                </div>
              </div>

              <div className="mb-4 flex w-full flex-row items-center">
                <Checkbox
                  onChange={setTermsChecked}
                  value={termsChecked}
                  rootClassName="border-neutral-300"
                />
                <span className="ml-2 w-full text-body5 text-neutralGreen-900">
                  By participating, you agree to the{' '}
                </span>
                <span className="w-full text-body5 text-mint-700 underline decoration-solid">
                  Terms and Conditions
                </span>
              </div>
              <Button
                intent="primary"
                size="large"
                isExternal
                asLink
                className="w-full"
              >
                CLAIM YOUR $IDRISS
              </Button>
            </div>
            <div className="ml-10 mr-10 h-[434px] w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50"></div>
            <div className="flex w-[389px] flex-col">
              <div className="flex flex-col gap-4">
                <span className="text-label2 text-neutralGreen-700">
                  ELIGIBILITY CRITERIA
                </span>
                <ExpandableInfo
                  title="REGISTERED IDRISS"
                  subTitle="1,200 IDRISS"
                  describtion="You have registered your account"
                />
                <ExpandableInfo
                  title="BROWSER EXTENSION USER"
                  subTitle="1,200 IDRISS"
                  describtion="You have made at least 1 transaction"
                />
                <ExpandableInfo
                  title="EARLY USER MULTIPLIER"
                  subTitle="200 IDRISS"
                  describtion="You have registered on 12 Dec, 2022"
                />
                <ExpandableInfo
                  title="REFERRAL MULTIPLIER"
                  subTitle="1,200 IDRISS"
                  describtion="You have invited 62 members"
                />
                <ExpandableInfo
                  title="EXTENSION USER"
                  subTitle="1,200 IDRISS"
                  describtion="You are an active member of Parallel"
                />
              </div>
              <div className="mt-4 h-px w-[389px] bg-[var(--Colors-Border-border-onsurface-primary,#E7FED8)] opacity-50"></div>
              <Button
                intent="tertiary"
                size="medium"
                isExternal
                asLink
                className="mt-8 w-full"
                suffixIconName="ArrowRight"
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Providers>
  );
}
