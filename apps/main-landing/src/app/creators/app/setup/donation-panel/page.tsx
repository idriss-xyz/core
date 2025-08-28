'use client';

import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { useState } from 'react';

import {
  Banner,
  filterOptions,
  type FilterOption,
} from '@/app/creators/components/banner';
import { PillLabel } from '@/app/creators/components/pill-label';

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
        <div className="relative my-4 flex gap-1.5">
          {filterOptions.map((option) => {
            return (
              <PillLabel
                key={option.label}
                option={option}
                isActive={activeFilter === option.label}
                onClick={(label) => {
                  return setActiveFilter(label as FilterOption);
                }}
                size="medium"
              />
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
