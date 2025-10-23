'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { tabOptions } from '../constants';

import { CreatorsSection } from './creators-section';
import { Tabs } from './tabs';

type Properties = {
  className?: string;
};

export const MobileProductsSection = ({ className }: Properties) => {
  const reference = useRef<HTMLDivElement>(null);
  const [currentTopSection, setCurrentTopSection] =
    useState<string>('extension');

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (reference.current) {
        const { left, top, width, height } =
          reference.current.getBoundingClientRect();

        const { x, y } = { x: left + width / 2, y: top + height / 2 };

        const currentTopSection = document
          .elementsFromPoint(x, y)
          .find((element) => {
            return element.tagName === 'SECTION';
          })?.id;
        if (currentTopSection) {
          setCurrentTopSection(currentTopSection);
        }
      }
    };

    window.addEventListener('landingPageScroll', handleScroll);

    return () => {
      window.removeEventListener('landingPageScroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={classes(
        'relative pt-10 text-label5 lg:flex lg:w-fit lg:-translate-x-4 lg:rounded-[50px] lg:p-1 lg:text-label4 lg:[position:unset]',
        'bg-[linear-gradient(0deg,transparent,rgb(21,43,30)_20%,rgb(21,43,30)_80%)] lg:bg-[#022218]',
      )}
    >
      <Tabs
        options={tabOptions}
        activeOptionKey={currentTopSection}
        asLink
        ref={reference}
      />
      {/* -mt-5 was added to compensate the Tabs height */}
      <section className={className} id="creators">
        <CreatorsSection fadeOut={false} />
      </section>
    </div>
  );
};
