'use client';
import { useEffect, useRef, useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { ProductSection } from './product-section';
import { CreatorsSectionData } from './creators-section';

type Properties = {
  className?: string;
};

const CIRCLE_IMAGE = `extension-to-community-notes-circle-optimized/IDRISS_CIRCLE_0095.webp`;

export const DesktopProductsSection = ({ className }: Properties) => {
  const containerReference = useRef<HTMLDivElement>(null);
  const topOfContainerReference = useRef<HTMLDivElement>(null);
  const firstSectionAnchorReference = useRef<HTMLDivElement>(null);
  const [margin, setMargin] = useState(40);
  const [borderRadius, setBorderRadius] = useState(40);
  const [isTopOfContainerFullyVisible, setIsTopOfContainerFullyVisible] =
    useState(false);
  const [isContainerVisible, setIsContainerVisible] = useState(false);

  useEffect(() => {
    const topOfContainerObserver = new IntersectionObserver(
      ([entry]) => {
        setIsTopOfContainerFullyVisible(entry?.intersectionRatio === 1);
      },
      { threshold: 1 },
    );

    const containerObserver = new IntersectionObserver(
      ([entry]) => {
        setIsContainerVisible((entry?.intersectionRatio ?? 0) > 0.25);
      },
      {
        threshold: Array.from({ length: 101 }, (_, index) => {
          return index / 100;
        }),
      },
    );

    const marginObserver = new IntersectionObserver(
      ([entry]) => {
        //if we navigate to the anchor the top container is skipped so we need to set margin 0 manually
        if (!isTopOfContainerFullyVisible && isContainerVisible) {
          setMargin(0);
          setBorderRadius(0);
          return;
        }

        if (isTopOfContainerFullyVisible) {
          const intersectionRatio = entry?.intersectionRatio ?? 0;

          if (intersectionRatio <= 0.5) {
            // When intersection is 0-50%, margin and radius stays at 40px
            setMargin(40);
            setBorderRadius(40);
          } else {
            // Map intersection ratio from 0.5-1 to 50-0 for margin and 40-0 for radius
            const calculatedValue = Math.round(
              40 * (2 - 2 * intersectionRatio),
            );
            setMargin(calculatedValue > 2 ? calculatedValue : 0);
            setBorderRadius(calculatedValue > 5 ? calculatedValue : 0);
          }
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, index) => {
          return index / 100;
        }),
      },
    );

    if (containerReference.current) {
      containerObserver.observe(containerReference.current);
    }
    if (topOfContainerReference.current) {
      topOfContainerObserver.observe(topOfContainerReference.current);
    }
    if (firstSectionAnchorReference.current) {
      marginObserver.observe(firstSectionAnchorReference.current);
    }

    return () => {
      containerObserver.disconnect();
      topOfContainerObserver.disconnect();
      marginObserver.disconnect();
    };
  }, [isTopOfContainerFullyVisible, isContainerVisible]);

  return (
    <section>
      <div ref={topOfContainerReference} className="h-px w-full" />
      <div
        className={classes('relative flex bg-mint-100', className)}
        ref={containerReference}
      >
        <div className="sticky left-0 top-0 z-30 h-screen w-screen">
          <ProductSection
            marginX={margin}
            marginY={margin / 2}
            borderRadius={borderRadius}
            actions={CreatorsSectionData.actions}
            activeOptionKey={CreatorsSectionData.defaultOptionKey}
            description={CreatorsSectionData.info.description}
            title={CreatorsSectionData.info.title}
            features={CreatorsSectionData.info.features}
            fadeOut={false}
            animated={false}
            circleImage={CIRCLE_IMAGE}
          />
        </div>
        <div className="w-[0.5px]">
          <div
            ref={firstSectionAnchorReference}
            id="streamers"
            className="my-10 h-screen"
          />
        </div>
      </div>
    </section>
  );
};
