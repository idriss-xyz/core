/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ANNOUNCEMENT_LINK } from '@idriss-xyz/constants';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { backgroundLines2, backgroundLines3 } from '@/assets';

import { Providers } from '../providers';
import { TopBar } from '../components/top-bar';

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
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        <div className="container relative mt-8 flex w-[460px] max-w-full flex-col items-center overflow-hidden rounded-xl bg-white px-1 pb-3 pt-6 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
          <link rel="preload" as="image" href={backgroundLines3.src} />
          <img
            alt=""
            src={backgroundLines3.src}
            className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
          />

          <div className="mb-6 flex w-full items-center">
            <IconButton
              asLink
              size="medium"
              href="/creators"
              intent="tertiary"
              iconName="ArrowLeft"
            />
            <h1 className="my-auto self-start text-balance text-heading4">
              Download a banner
            </h1>
          </div>

          <ScrollArea className="right-0 max-h-[350px] transition-all duration-500">
            <div className="grid w-full grid-cols-2 justify-center gap-4 px-3">
              {banners.map((banner) => {
                const isSelected = banner.src === selectedBannerSource;

                return (
                  <div
                    key={banner.src}
                    className="relative select-none overflow-hidden rounded-lg"
                  >
                    <link rel="preload" as="image" href={banner.src} />
                    <img
                      alt=""
                      width={600}
                      height={200}
                      src={banner.src}
                      onClick={() => {
                        setSelectedBannerSource(banner.src);
                      }}
                      className={classes(
                        'cursor-pointer rounded-lg p-[1px] transition-transform duration-300 hover:scale-[1.03]',
                        isSelected && 'border border-mint-400 p-0',
                      )}
                    />

                    {isSelected && (
                      <div className="absolute right-3 top-3 flex size-4 cursor-pointer items-center justify-center rounded-full bg-mint-400 p-[3px]">
                        <Icon
                          size={20}
                          name="Check"
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
              size="medium"
              intent="secondary"
              className="mt-6 w-full"
              onClick={handleDownload}
              disabled={!selectedBannerSource}
            >
              DOWNLOAD
            </Button>
          </div>
        </div>

        <Button
          asLink
          isExternal
          size="small"
          intent="secondary"
          prefixIconName="InfoCircle"
          href={ANNOUNCEMENT_LINK.CREATORS_DONATIONS}
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
        >
          STEP-BY-STEP GUIDE
        </Button>
      </main>
    </Providers>
  );
}
