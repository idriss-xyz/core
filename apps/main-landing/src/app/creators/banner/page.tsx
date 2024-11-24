'use client';
import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ANNOUNCEMENT_LINK } from '@idriss-xyz/constants';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { TopBar } from '@/components';
import { backgroundLines2, backgroundLines3 } from '@/assets';

import { Providers } from '../providers';

import {
  banner1,
  banner10,
  banner11,
  banner12,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
  banner8,
  banner9,
} from './assets';

const banners = [
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
  banner8,
  banner9,
  banner10,
  banner11,
  banner12,
];

// ts-unused-exports:disable-next-line
export default function Banner() {
  const [selectedBannerSource, setSelectedBannerSource] = useState<string>();

  const handleDownload = () => {
    if (!selectedBannerSource) {
      return;
    }
    const link = document.createElement('a');
    link.href = selectedBannerSource;
    link.download = 'creator-banner.png';
    document.body.append(link);
    link.click();
    link.remove();
  };

  return (
    <Providers>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#b5d8ae_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="container relative mt-8 flex w-[460px] max-w-full flex-col items-center overflow-hidden rounded-xl bg-white px-1 pb-3 pt-6 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
          <Image
            priority
            src={backgroundLines3}
            className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
            alt=""
          />
          <div className="mb-6 flex w-full items-center">
            <IconButton
              asLink
              href="/creators"
              iconName="ArrowLeft"
              intent="tertiary"
              size="medium"
            />
            <h1 className="my-auto self-start text-balance text-heading4">
              Download a banner
            </h1>
          </div>
          <ScrollArea
            className="right-0 max-h-[350px] transition-all duration-500"
            scrollBarClassName="bg-white hover:bg-white data-[orientation=vertical]:w-2.5 "
          >
            <div className="grid w-full grid-cols-2 justify-center gap-4 px-3">
              {banners.map((banner) => {
                const isSelected = banner.src === selectedBannerSource;
                return (
                  <div
                    className="relative select-none overflow-hidden rounded-lg"
                    key={banner.src}
                  >
                    <Image
                      onClick={() => {
                        setSelectedBannerSource(banner.src);
                      }}
                      className={classes(
                        'cursor-pointer rounded-lg p-[1px] transition-transform duration-300 hover:scale-[1.03]',
                        isSelected && 'border border-mint-400 p-0',
                      )}
                      priority
                      width={600}
                      height={200}
                      src={banner}
                      alt=""
                    />
                    {isSelected && (
                      <div className="absolute right-3 top-3 flex size-4 cursor-pointer items-center justify-center rounded-full bg-mint-400 p-[3px]">
                        <Icon
                          name="Check"
                          size={20}
                          className="text-white [&_path]:stroke-[3]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="flex w-full px-3">
            <Button
              disabled={!selectedBannerSource}
              className="mt-6 w-full"
              intent="secondary"
              size="medium"
              onClick={handleDownload}
            >
              DOWNLOAD
            </Button>
          </div>
        </div>
        <Button
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
          intent="secondary"
          size="small"
          prefixIconName="InfoCircle"
          href={ANNOUNCEMENT_LINK.CREATORS_DONATIONS}
          isExternal
          asLink
        >
          STEP-BY-STEP GUIDE
        </Button>
      </main>
    </Providers>
  );
}
