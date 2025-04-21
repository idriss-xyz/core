'use client';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';
import { Marquee } from '@idriss-xyz/ui/marquee';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import {
  DafaqtorCard,
  ExcelsorphCard,
  DmoneyCard,
  Qflux888Card,
  LambyseriestvCard,
  ViperCard,
  YoJurmyCard,
} from './assets';

const creators = [
  {
    name: 'dafaqtor',
    followers: '3.7K',
    image: DafaqtorCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/dafaqtor"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
      ),
    },
  },
  {
    name: 'ExcelSorPH',
    followers: '2.8K',
    image: ExcelsorphCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/excelsorph"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
      ),
    },
  },
  {
    name: 'Dmoney',
    followers: '18.3K',
    image: DmoneyCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/dmoney"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
      ),
    },
  },
  {
    name: 'qFlux888',
    followers: '3.4K',
    image: Qflux888Card.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/qflux888"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
      ),
    },
  },
  {
    name: 'lambyseriestv',
    followers: '32.1K',
    image: LambyseriestvCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/lambyseriestv"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
      ),
    },
  },
  {
    name: 'viper_9337',
    followers: '19K',
    image: ViperCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/viper_9337"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
      ),
    },
  },
  {
    name: 'YoJurmy',
    followers: '675',
    image: YoJurmyCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/yojurmy"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8 hover:text-black"
        />
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
            className="relative size-full min-w-[250px] overflow-hidden rounded-[36px] md:min-w-[350px]"
          >
            <span className="absolute right-0 top-0 z-0 size-full bg-[linear-gradient(180deg,_rgba(255,255,255,0)_47.96%,_rgba(5,171,19,0.5)_80.74%)]" />

            <img
              alt=""
              src={creator.image}
              className="z-1 block aspect-[4/5] size-full min-h-full max-w-[250px] object-cover md:max-w-screen-xs"
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

              <div className="flex w-full flex-row items-center justify-between gap-x-2 md:justify-start">
                <span
                  className={classes(
                    'text-heading6 text-midnightGreen-900',
                    'md:text-heading5',
                    'lg:text-heading4',
                  )}
                >
                  {creator.name}
                </span>

                {creator.platform.icon}
              </div>
            </div>
          </div>
        );
      })}
    />
  );
};
