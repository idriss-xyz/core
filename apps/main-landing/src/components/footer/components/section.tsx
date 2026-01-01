import { Button } from '@idriss-xyz/ui/button';
import { forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { SectionItem } from '../types';

type Properties = {
  title: string;
  items: SectionItem[];
};

export const Section = forwardRef<HTMLDivElement, Properties>(
  ({ title, items }, reference) => {
    return (
      <div ref={reference}>
        <span
          className={classes(
            'mb-6 block text-label5 text-neutral-500',
            'lg:text-label4',
          )}
        >
          {title}
        </span>
        <ul className="list-none space-y-2">
          {items.map((item, index) => {
            return (
              <li key={index}>
                <Button
                  className="pl-0 text-left"
                  intent="tertiary"
                  size="small"
                  prefixIconName={item.prefixIconName}
                  href={item.link}
                  isExternal={item.isExternal}
                  asLink
                >
                  {item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

Section.displayName = 'Section';
