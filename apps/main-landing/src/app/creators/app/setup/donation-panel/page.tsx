'use client';

import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';

import {
  Banner,
  filterOptions,
  type FilterOption,
} from '@/app/creators/components/banner';

// ts-unused-exports:disable-next-line
export default function DonationPanel() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  return (
    <Card>
      <CardHeader>
        <h1 className="pb-1 text-heading4 text-neutralGreen-900">
          Download your donation panel image
        </h1>
        <hr />
        <div className="relative my-4 flex gap-1.5 font-medium">
          {filterOptions.map((option) => {
            return (
              <span
                key={option.label}
                onClick={() => {
                  return setActiveFilter(option.label);
                }}
                className={classes(
                  'flex h-[34px] cursor-pointer items-center justify-center gap-1 rounded-full border border-mint-400 px-3 py-1 text-label4 text-neutralGreen-900',
                  activeFilter === option.label ? 'bg-mint-400' : 'bg-white/80',
                )}
              >
                {option.icon ? (
                  <Icon
                    size={16}
                    name={option.icon}
                    className="text-[#757575]"
                  />
                ) : null}
                {option.label}
              </span>
            );
          })}
        </div>
      </CardHeader>
      <CardBody>
        <Banner filter={activeFilter} />
      </CardBody>
    </Card>
  );
}
