'use client';
import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

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
      <main className="relative flex grow items-start justify-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pt-[56px] lg:px-0">
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="container relative mt-10 flex w-[460px] max-w-full flex-col items-center overflow-hidden rounded-xl bg-white px-4 pb-3 pt-6 lg:mt-[108px]">
          <Image
            priority
            src={backgroundLines3}
            className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
            alt=""
          />
          <div className="flex w-full items-center">
            <IconButton
              asLink
              href="/creators"
              iconName="ArrowLeft"
              intent="tertiary"
              size="medium"
            />
            <h1 className="my-auto self-start text-balance text-heading4">
              Download a banner for you
            </h1>
          </div>
          <div className="mt-6 grid w-full grid-cols-2 justify-center gap-4">
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
      </main>
    </Providers>
  );
}
