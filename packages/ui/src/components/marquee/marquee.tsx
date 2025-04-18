'use client';
import { ReactNode, useEffect, useState } from 'react';

import { classes } from '../../utils';

type Properties = {
  reverse?: boolean;
  items: ReactNode[];
  className?: string;
  pauseOnHover?: boolean;
  sliderClassName?: string;
  gap?: 'sm' | 'md' | 'lg';
  displaySideBlur?: boolean;
  sideBlurVariant?: 'side-blur' | 'side-blur-2';
};

export const Marquee = ({
  items,
  className,
  gap = 'lg',
  sliderClassName,
  reverse = false,
  pauseOnHover = true,
  displaySideBlur = true,
  sideBlurVariant = 'side-blur',
}: Properties) => {
  const [isRendered, setIsRendered] = useState(false);

  const gapClassMap: Record<string, string> = {
    sm: 'pl-2 lg:pl-8',
    md: 'pl-8 lg:pl-10',
    lg: 'pl-10 lg:pl-[60px]',
  };

  const spaceClassMap: Record<string, string> = {
    sm: 'space-x-2 lg:space-x-8',
    md: 'space-x-8 lg:space-x-10',
    lg: 'space-x-10 lg:space-x-[60px]',
  };

  const listGapClassName = gapClassMap[gap];
  const spaceClassName = spaceClassMap[gap];

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return (
    <div
      className={classes(
        'group relative flex items-center justify-start overflow-clip',
        displaySideBlur && sideBlurVariant,
        className,
      )}
    >
      <ul
        className={classes(
          'flex min-w-max list-none whitespace-nowrap will-change-[transform]',
          listGapClassName,
          spaceClassName,
          isRendered &&
            (reverse ? 'animate-marquee-reverse' : 'animate-marquee'),
          pauseOnHover &&
            'group-focus-within:paused-animation group-hover:paused-animation',
          sliderClassName,
        )}
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              className="flex min-w-max cursor-pointer items-center space-x-2"
            >
              {item}
            </li>
          );
        })}
      </ul>

      <ul
        className={classes(
          'absolute flex min-w-max list-none whitespace-nowrap will-change-[transform]',
          listGapClassName,
          spaceClassName,
          isRendered &&
            (reverse ? 'animate-marquee2-reverse' : 'animate-marquee2'),
          pauseOnHover &&
            'group-focus-within:paused-animation group-hover:paused-animation',
          sliderClassName,
        )}
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              className="flex min-w-max cursor-pointer items-center space-x-2"
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
