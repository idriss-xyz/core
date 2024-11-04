import { Button } from '@idriss-xyz/ui/button';
import { forwardRef } from 'react';
import Link from 'next/link';

import { SectionItem } from '../types';

type Properties = {
  title: string;
  items: SectionItem[];
};

export const Section = forwardRef<HTMLDivElement, Properties>(
  ({ title, items }, reference) => {
    return (
      <div ref={reference}>
        <span className="mb-6 block text-label5 text-neutral-500 lg:text-label4">
          {title}
        </span>
        <ul className="list-none space-y-2">
          {items.map((item, index) => {
            if (item.isExternal) {
              return (
                <li key={index}>
                  <Button
                    className="pl-0 text-left"
                    intent="tertiary"
                    size="small"
                    prefixIconName={item.prefixIconName}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    asLink
                  >
                    {item.name}
                  </Button>
                </li>
              );
            }
            return (
              <li key={index}>
                <Link href={item.link} passHref legacyBehavior>
                  <Button
                    className="pl-0 text-left"
                    intent="tertiary"
                    size="small"
                    prefixIconName={item.prefixIconName}
                    asLink
                  >
                    {item.name}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

Section.displayName = 'Section';
