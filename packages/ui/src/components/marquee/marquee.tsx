'use client';
import { ReactNode, useEffect, useState } from 'react';

import { classes } from '../../utils';

type Properties = {
  items: ReactNode[];
  pauseOnHover?: boolean;
  className?: string;
};

export const Marquee = ({
  items,
  pauseOnHover = true,
  className,
}: Properties) => {
  const [isRendered, setIsRendered] = useState(false);

  const spaceClassName = 'space-x-10 lg:space-x-[60px]';

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
          'flex list-none whitespace-nowrap pl-10 will-change-[transform] lg:pl-[60px]',
          spaceClassName,
          isRendered && 'animate-marquee',
          pauseOnHover &&
            'group-focus-within:paused-animation group-hover:paused-animation',
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
          'absolute flex list-none whitespace-nowrap pl-10 will-change-[transform] lg:pl-[60px]',
          spaceClassName,
          isRendered && 'animate-marquee2',
          pauseOnHover &&
            'group-focus-within:paused-animation group-hover:paused-animation',
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
