import { ReactNode } from 'react';

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
  const spaceClassName = 'space-x-10 lg:space-x-[60px]';

  return (
    <div
      className={classes(
        'group relative flex items-center justify-start overflow-clip side-blur',
        className,
      )}
    >
      <ul
        className={classes(
          'flex animate-marquee list-none whitespace-nowrap pl-10 lg:pl-[60px]',
          spaceClassName,
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
          'absolute flex animate-marquee2 list-none whitespace-nowrap pl-10 lg:pl-[60px]',
          spaceClassName,
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
