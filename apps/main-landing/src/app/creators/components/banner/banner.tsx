/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

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
  { src: banner1.src, type: 'unbranded' },
  { src: banner2.src, type: 'parallel' },
  { src: banner3.src, type: 'parallel' },
  { src: banner4.src, type: 'parallel' },
  { src: banner5.src, type: 'parallel' },
  { src: banner6.src, type: 'parallel' },
  { src: banner7.src, type: 'parallel' },
  { src: banner8.src, type: 'aavegotchi' },
  { src: banner9.src, type: 'aavegotchi' },
  { src: banner10.src, type: 'aavegotchi' },
  { src: banner11.src, type: 'unbranded' },
  { src: banner12.src, type: 'unbranded' },
];

export const Banner = () => {
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
    <div className="container relative flex flex-col items-center rounded-xl bg-white pb-3 pt-6">
      <ScrollArea className="transition-all duration-500">
        <div className="grid w-full grid-cols-2 justify-center gap-4">
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
          intent="primary"
          className="mt-6"
          onClick={handleDownload}
          disabled={!selectedBannerSource}
        >
          DOWNLOAD
        </Button>
      </div>
    </div>
  );
};
