/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { backgroundLines3 } from '@/assets';

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

export const Banner = ({ onBack }: { onBack?: () => void }) => {
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
    <div className="container relative mt-8 flex flex-col items-center overflow-hidden rounded-xl bg-white px-1 pb-3 pt-6">
      <link rel="preload" as="image" href={backgroundLines3.src} />
      <img
        alt=""
        src={backgroundLines3.src}
        className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
      />

      <div className="mb-6 flex w-full items-center">
        <IconButton
          size="medium"
          intent="tertiary"
          iconName="ArrowLeft"
          onClick={onBack}
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
  );
};
