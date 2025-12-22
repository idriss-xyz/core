'use client';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';
import { Marquee } from '@idriss-xyz/ui/marquee';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import {
  DafaqtorCard,
  ExcelsorphCard,
  BabyBearHSCard,
  DmoneyCard,
  ThijsCard,
  LambyseriestvCard,
  ViperCard,
  YoJurmyCard,
  FenoHSCard,
  AlliestraszaCard,
  PandappleCard,
  HamHocks42Card,
  SequinoxTVCard,
  JambreCard,
} from './assets';

const creators = [
  {
    name: 'dafaqtor',
    followers: '3.6K',
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
          className="size-6 text-mint-200 md:size-8"
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
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'BabyBearHS',
    followers: '8.4K',
    image: BabyBearHSCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://twitch.tv/BabybearHS"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'Dmoney',
    followers: '18.2K',
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
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'Alliestrasza',
    followers: '232K',
    image: AlliestraszaCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/alliestrasza"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'Thijs',
    followers: '795K',
    image: ThijsCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/thijs"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'lambyseriestv',
    followers: '32.2K',
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
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'Pandapple',
    followers: '5.5K',
    image: PandappleCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/pandapple"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'SequinoxTV',
    followers: '13.2K',
    image: SequinoxTVCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/sequinoxtv"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'viper_9337',
    followers: '18.9K',
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
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'HamHocks42',
    followers: '5.4K',
    image: HamHocks42Card.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/hamhocks42"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'YoJurmy',
    followers: '672',
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
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'FenoHS',
    followers: '90K',
    image: FenoHSCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/fenohs"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
  {
    name: 'Jambre',
    followers: '25.6K',
    image: JambreCard.src,
    platform: {
      icon: (
        <IconButton
          asLink
          isExternal
          href="https://www.twitch.tv/jambre"
          iconName="TwitchOutlinedBold"
          size="extra"
          intent="tertiary"
          className="size-6 text-mint-200 md:size-8"
        />
      ),
    },
  },
];

type Properties = {
  reverse?: boolean;
  className?: string;
  sliderClassName?: string;
  offset?: number;
};

export const TopCreatorsShowcase = ({
  reverse,
  className,
  sliderClassName,
  offset,
}: Properties) => {
  const creatorsToMap = reverse ? [...creators].reverse() : creators;
  const offsetCreators = offset
    ? [...creatorsToMap.slice(offset), ...creatorsToMap.slice(0, offset)]
    : creatorsToMap;

  return (
    <Marquee
      gap="sm"
      reverse={reverse}
      displaySideBlur={false}
      sliderClassName={sliderClassName}
      className={classes('w-full', className)}
      items={offsetCreators.map((creator, index) => {
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
