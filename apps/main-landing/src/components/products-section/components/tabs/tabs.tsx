import { classes } from '@idriss-xyz/ui/utils';
import Link from 'next/link';

import { TabOption } from '../../types';

type Properties = {
  options: TabOption[];
  activeOptionKey: string;
  asLink: boolean;
};

export const Tabs = ({ activeOptionKey, options, asLink }: Properties) => {
  return (
    <div className="flex items-start gap-1 rounded-[50px] bg-[#022218] p-1 text-label5 lg:text-label4">
      {options.map((option) => {
        return asLink ? (
          <Link
            href={`/#${option.key}`}
            key={option.key}
            className={classes(
              'flex cursor-pointer items-start rounded-[100px] bg-[#17ff4a1a] px-[9.5px] py-2 text-midnightGreen-100 transition-colors duration-1000 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 lg:px-4',
              activeOptionKey === option.key &&
                'bg-mint-400 text-neutralGreen-900',
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
