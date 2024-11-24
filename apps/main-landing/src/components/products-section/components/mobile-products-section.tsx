'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { tabOptions } from '../constants';

import { CreatorsSection } from './creators-section';
import { ExtensionSection } from './extension-section';
import { PredictionMarketsSection } from './prediction-markets-section';
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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative bg-[#022B1E]">
      <Tabs
        options={tabOptions}
        activeOptionKey={currentTopSection}
        asLink
        ref={reference}
      />
      <section className={className} id="extension">
        <ExtensionSection fadeOut={false} headerClassName="pt-0" />
      </section>
      <section className={className} id="creators">
        <CreatorsSection fadeOut={false} />
      </section>
      <section className={className} id="prediction-markets">
        <PredictionMarketsSection fadeOut={false} />
      </section>
    </div>
  );
};
