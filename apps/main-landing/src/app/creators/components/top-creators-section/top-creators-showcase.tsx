'use client';
import { Icon } from '@idriss-xyz/ui/icon';
import { Marquee } from '@idriss-xyz/ui/marquee';
import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';

import { MarocosCard, OutstarCard, SmayroCard, RubiusCard } from './assets';

const creators = [
  {
    name: 'Marocos231',
    followers: '232.9K',
    image: MarocosCard.src,
    platform: {
      url: 'https://twitch.tv',
      icon: (
        <Icon name="TwitchOutlinedBold" size={32} className="text-mint-200" />
      ),
    },
  },
  {
    name: 'Smayro',
    followers: '100.9K',
    image: SmayroCard.src,
    platform: {
      url: 'https://twitch.tv',
      icon: (
        <Icon name="TwitchOutlinedBold" size={32} className="text-mint-200" />
      ),
    },
  },
  {
    name: 'Outstar',
    followers: '65.6K',
    image: OutstarCard.src,
    platform: {
      url: 'https://twitch.tv',
      icon: (
        <Icon name="TwitchOutlinedBold" size={32} className="text-mint-200" />
      ),
    },
  },
  {
    name: 'Rubius',
    followers: '90.2K',
    image: RubiusCard.src,
    platform: {
      url: 'https://twitch.tv',
      icon: (
        <Icon name="TwitchOutlinedBold" size={32} className="text-mint-200" />
      ),
    },
  },
];

type Properties = {
  reverse?: boolean;
  className?: string;
  sliderClassName?: string;
};

export const TopCreatorsShowcase = ({
  reverse,
  className,
  sliderClassName,
}: Properties) => {
  const creatorsToMap = reverse ? [...creators].reverse() : creators;

  return (
    <Marquee
      gap="sm"
      reverse={reverse}
      displaySideBlur={false}
      sliderClassName={sliderClassName}
      className={classes('w-full', className)}
      items={creatorsToMap.map((creator, index) => {
        return (
          <div
            key={`top-creators-slide-${index}`}
            className="relative size-full min-w-[250px] overflow-hidden rounded-[36px] lg:min-w-[350px]"
          >
            <span className="absolute right-0 top-0 z-0 size-full bg-[linear-gradient(180deg,_rgba(255,255,255,0)_47.96%,_rgba(5,171,19,0.5)_80.74%)]" />

            <img
              alt=""
              src={creator.image}
              className="z-1 block aspect-[4/5] size-full min-h-full max-w-[250px] object-cover lg:max-w-[400px]"
            />

            <div className="absolute bottom-6 left-6 flex w-[calc(100%-3rem)] flex-col items-start gap-y-2 rounded-3xl bg-white/40 p-4 shadow-card">
              <GradientBorder
                borderWidth={1}
                gradientDirection="toBottom"
                gradientStartColor="#D2F85D66"
                gradientStopColor="#C5EF430A"
              />

              <span
                className={classes(
                  'rounded-[100px] bg-mint-400 p-2 text-label8 text-neutralGreen-900',
                  'md:text-label7',
                  'lg:text-label6',
                )}
              >
                {creator.followers} followers
              </span>

              <div className="flex flex-row items-center gap-x-2">
                <span
                  className={classes(
                    'text-heading6 text-midnightGreen-900',
                    'md:text-heading5',
                    'lg:text-heading4',
                  )}
                >
                  {creator.name}
                </span>

                <Link
                  isExternal
                  size="medium"
                  className="border-none p-0"
                  href={creator.platform.url}
                >
                  {creator.platform.icon}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    />
  );
};
