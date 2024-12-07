import { classes } from '@idriss-xyz/ui/utils';
import Link from 'next/link';
import { RefObject } from 'react';

import { TabOption } from '../../types';

type Properties = {
  options: TabOption[];
  activeOptionKey: string;
  asLink: boolean;
  ref?: RefObject<HTMLDivElement>;
};

export const Tabs = ({ activeOptionKey, options, asLink, ref }: Properties) => {
  return (
    <div
      ref={ref}
      className="sticky left-0 top-0 z-[9999] flex w-screen items-start gap-1 bg-[linear-gradient(0deg,transparent,rgba(2,34,24,1)_20%,rgba(2,34,24,1)_80%)] p-3 py-5 text-label5 lg:flex lg:w-fit lg:-translate-x-4 lg:rounded-[50px] lg:bg-[#022218] lg:p-1 lg:text-label4 lg:[position:unset]"
    >
      {options.map((option) => {
        return asLink ? (
          <Link
            href={`/#${option.key}`}
            key={option.key}
            className={classes(
              'flex cursor-pointer items-start rounded-[100px] bg-[#043f22] px-[9.5px] py-2 text-midnightGreen-100 transition-colors duration-1000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 lg:bg-[#17ff4a1a] lg:px-4',
              activeOptionKey === option.key &&
                'bg-mint-400 text-neutralGreen-900 lg:bg-mint-400',
            )}
          >
            {option.name}
          </Link>
        ) : (
          <span
            key={option.key}
            className={classes(
              'rounded-[100px] bg-[#17ff4a1a] px-[9.5px] py-2 text-midnightGreen-100 lg:px-4',
              activeOptionKey === option.key &&
                'bg-mint-400 text-neutralGreen-900',
            )}
          >
            {option.name}
          </span>
        );
      })}
    </div>
  );
};
