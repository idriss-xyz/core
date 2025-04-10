'use client';
import { ReactNode, useEffect, useState } from 'react';

import { classes } from '../../utils';

type Properties = {
  gap?: 'md' | 'lg';
  items: ReactNode[];
  pauseOnHover?: boolean;
  className?: string;
  sliderClassName?: string;
};

export const Marquee = ({
  gap,
  items,
  pauseOnHover = true,
  className,
  sliderClassName,
}: Properties) => {
  const [isRendered, setIsRendered] = useState(false);

  const listGapClassName = gap === 'md' ? 'pl-6 lg:pl-8' : 'pl-10 lg:pl-[60px]';

  const spaceClassName =
    gap === 'md' ? 'space-x-6 lg:space-x-8' : 'space-x-10 lg:space-x-[60px]';

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return (
    <div
      className={classes(
        'group relative flex items-center justify-start overflow-clip side-blur',
        className,
      )}
    >
      <ul
        className={classes(
          'flex list-none whitespace-nowrap will-change-[transform]',
          listGapClassName,
          spaceClassName,
          isRendered && 'animate-marquee',
          pauseOnHover &&
            'group-focus-within:paused-animation group-hover:paused-animation',
          sliderClassName,
        )}
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              className="flex cursor-pointer items-center space-x-2"
            >
              {item}
            </li>
          );
        })}
      </ul>

      <ul
        className={classes(
          'absolute flex list-none whitespace-nowrap will-change-[transform]',
          listGapClassName,
          spaceClassName,
          isRendered && 'animate-marquee2',
          pauseOnHover &&
            'group-focus-within:paused-animation group-hover:paused-animation',
          sliderClassName,
        )}
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              className="flex cursor-pointer items-center space-x-2"
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
