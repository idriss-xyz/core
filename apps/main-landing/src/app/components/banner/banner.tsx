/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { useEffect, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import {
  banner1,
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
  banner37,
  banner22,
  banner23,
  banner24,
  banner25,
  banner26,
  banner27,
  banner28,
  banner29,
  banner30,
  banner31,
  banner32,
  banner33,
  banner34,
  banner35,
  banner36,
  banner38,
  banner39,
  banner40,
  banner41,
  banner42,
  banner43,
  banner44,
  banner45,
} from './assets';
import { FilterOption } from './utils';

type Banner = {
  src: string;
  type: string;
};

const shuffleArray = (array: Banner[]): Banner[] => {
  const shuffled = [...array];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const index_ = Math.floor(Math.random() * (index + 1));
    const temporary = shuffled[index]!;
    shuffled[index] = shuffled[index_]!;
    shuffled[index_] = temporary;
  }
  return shuffled;
};

const banners: Banner[] = [
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
  { src: banner22.src, type: 'parallel' },
  { src: banner23.src, type: 'parallel' },
  { src: banner24.src, type: 'parallel' },
  { src: banner25.src, type: 'parallel' },
  { src: banner26.src, type: 'parallel' },
  { src: banner27.src, type: 'parallel' },
  { src: banner28.src, type: 'parallel' },
  { src: banner29.src, type: 'parallel' },
  { src: banner30.src, type: 'parallel' },
  { src: banner31.src, type: 'parallel' },
  { src: banner32.src, type: 'parallel' },
  { src: banner33.src, type: 'parallel' },
  { src: banner34.src, type: 'parallel' },
  { src: banner35.src, type: 'parallel' },
  { src: banner36.src, type: 'parallel' },
  { src: banner37.src, type: 'parallel' },
  { src: banner38.src, type: 'parallel' },
  { src: banner39.src, type: 'parallel' },
  { src: banner40.src, type: 'avalanche' },
  { src: banner41.src, type: 'avalanche' },
  { src: banner42.src, type: 'avalanche' },
  { src: banner43.src, type: 'avalanche' },
  { src: banner44.src, type: 'avalanche' },
  { src: banner45.src, type: 'avalanche' },
];

interface Properties {
  filter: FilterOption;
}

export const Banner = ({ filter }: Properties) => {
  const [selectedBannerSource, setSelectedBannerSource] = useState<string>();
  const [shuffledBanners, setShuffledBanners] = useState(banners);

  useEffect(() => {
    setSelectedBannerSource(undefined);
    if (filter === 'All') {
      setShuffledBanners(shuffleArray(banners));
    }
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

  const filteredBanners =
    filter === 'All'
      ? shuffledBanners
      : banners.filter((banner) => {
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
