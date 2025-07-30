/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { useEffect, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import {
  banner1,
  // banner10,
  banner13,
  banner14,
  banner15,
  banner16,
  banner17,
  banner18,
  banner19,
  banner20,
  banner21,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
  // banner8,
  // banner9,
} from './assets';
import { FilterOption } from './utils';

const banners = [
  { src: banner1.src, type: 'unbranded' },
  { src: banner2.src, type: 'parallel' },
  { src: banner3.src, type: 'parallel' },
  { src: banner4.src, type: 'parallel' },
  { src: banner5.src, type: 'parallel' },
  { src: banner6.src, type: 'parallel' },
  { src: banner7.src, type: 'parallel' },
  { src: banner13.src, type: 'ronin' },
  { src: banner14.src, type: 'ronin' },
  { src: banner15.src, type: 'vibes (pudgy tcg)' },
  { src: banner16.src, type: 'vibes (pudgy tcg)' },
  { src: banner17.src, type: 'vibes (pudgy tcg)' },
  { src: banner18.src, type: 'vibes (pudgy tcg)' },
  { src: banner19.src, type: 'vibes (pudgy tcg)' },
  { src: banner20.src, type: 'vibes (pudgy tcg)' },
  { src: banner21.src, type: 'paragonsdao' },
  // { src: banner8.src, type: 'aavegotchi' },
  // { src: banner9.src, type: 'aavegotchi' },
  // { src: banner10.src, type: 'aavegotchi' },
];

interface Properties {
  filter: FilterOption;
}

export const Banner = ({ filter }: Properties) => {
  const [selectedBannerSource, setSelectedBannerSource] = useState<string>();

  useEffect(() => {
    setSelectedBannerSource(undefined);
  }, [filter]);

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

  const filteredBanners = banners.filter((banner) => {
    if (filter === 'All') {
      return true;
    }
    return banner.type === filter.toLowerCase();
  });

  return (
    <div className="container relative flex flex-col items-center rounded-xl bg-white pb-3">
      <ScrollArea className="transition-all duration-500">
        <div className="grid w-full grid-cols-2 justify-center gap-4">
          {filteredBanners.map((banner) => {
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
