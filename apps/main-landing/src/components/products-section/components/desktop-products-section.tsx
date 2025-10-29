'use client';
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDebounce, usePrevious } from 'react-use';
import { classes } from '@idriss-xyz/ui/utils';

import { ProductSection } from './product-section';
import { CreatorsSectionData } from './creators-section';

type Properties = {
  className?: string;
  isFirstRender: MutableRefObject<boolean>;
};

const getSectionNumberByName = (key: string) => {
  return key === 'creators' ? 0 : undefined;
};

const CIRCLE_IMAGE_NUMBER_START_GAP = 38;
const CIRCLE_IMAGES_COUNT = 113;
const CREATORS_CIRCLE_INDEX = 57;

const CIRCLE_IMAGES_BASE_NAME = `extension-to-community-notes-circle-optimized/IDRISS_CIRCLE_`;

const circleImages = [...Array.from({ length: CIRCLE_IMAGES_COUNT }).keys()]
  .map((_, index) => {
    return `${CIRCLE_IMAGES_BASE_NAME}${(index + CIRCLE_IMAGE_NUMBER_START_GAP).toString().padStart(4, '0')}.webp`;
  })
  .reverse();

const EXTENSION_CIRCLE_PLACEHOLDER = CIRCLE_IMAGES_BASE_NAME + '0150.webp';
export const DesktopProductsSection = ({
  className,
  isFirstRender,
}: Properties) => {
  const containerReference = useRef<HTMLDivElement>(null);
  const topOfContainerReference = useRef<HTMLDivElement>(null);
  const firstSectionAnchorReference = useRef<HTMLDivElement>(null);
  const [margin, setMargin] = useState(40);
  const [borderRadius, setBorderRadius] = useState(40);
  const [isTopOfContainerFullyVisible, setIsTopOfContainerFullyVisible] =
    useState(false);
  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const [isContainerFillingScreen, setIsContainerFillingScreen] =
    useState(false);
  const windowHash =
    typeof window === 'undefined' ? '' : window.location.hash.slice(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    (isFirstRender && getSectionNumberByName(windowHash)) ?? 0,
  );

  const [debouncedCurrentSectionIndex, setDebouncedCurrentSectionIndex] =
    useState(0);
  const previousSectionIndex = usePrevious(debouncedCurrentSectionIndex);

  const [_] = useDebounce(
    () => {
      return setDebouncedCurrentSectionIndex(currentSectionIndex);
    },
    1000,
    [currentSectionIndex],
  );

  const sectionsData = useMemo(() => {
    return [CreatorsSectionData];
  }, []);
  const numberOfSections = sectionsData.length;

  const animationDirection = useMemo(() => {
    if (previousSectionIndex === undefined) {
      return 'forward';
    }

    return previousSectionIndex < currentSectionIndex ? 'forward' : 'backward';
  }, [currentSectionIndex, previousSectionIndex]);

  const animationFps = useMemo(() => {
    return previousSectionIndex !== undefined &&
      Math.abs(currentSectionIndex - previousSectionIndex) > 1
      ? 45
      : 30;
  }, [currentSectionIndex, previousSectionIndex]);

  const animationStartIndex = useMemo(() => {
    const sectionIndex =
      previousSectionIndex === undefined
        ? 0
        : Math.min(previousSectionIndex, currentSectionIndex);

    switch (sectionIndex) {
      case 0: {
        return CREATORS_CIRCLE_INDEX;
      }
      default: {
        return CREATORS_CIRCLE_INDEX;
      }
    }
  }, [currentSectionIndex, previousSectionIndex]);

  const animationEndIndex = useMemo(() => {
    const sectionIndex =
      previousSectionIndex === undefined
        ? currentSectionIndex
        : Math.max(previousSectionIndex, currentSectionIndex);

    switch (sectionIndex) {
      case 0: {
        return CREATORS_CIRCLE_INDEX;
      }
      default: {
        return CREATORS_CIRCLE_INDEX;
      }
    }
  }, [currentSectionIndex, previousSectionIndex]);

  const selectedSectionData = useMemo(() => {
    return sectionsData[debouncedCurrentSectionIndex] ?? CreatorsSectionData;
  }, [debouncedCurrentSectionIndex, sectionsData]);

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
        setIsContainerFillingScreen((entry?.intersectionRatio ?? 0) > 0.32);
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

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!containerReference.current) {
        setCurrentSectionIndex(0);
        return;
      }

      const { top } = containerReference.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const amountAboveViewport = Math.max(0, -top);
      const normalizedPercentAbove =
        amountAboveViewport / viewportHeight / numberOfSections;

      const sectionId = Math.floor(
        Math.min(
          (normalizedPercentAbove * 100) / ((1 / (numberOfSections + 2)) * 100),
          numberOfSections - 1,
        ),
      );

      setCurrentSectionIndex(sectionId);
    };

    window.addEventListener('landingPageScroll', handleScroll);

    return () => {
      window.removeEventListener('landingPageScroll', handleScroll);
    };
  }, [numberOfSections]);

  useEffect(() => {
    let timeoutReference: NodeJS.Timeout;
    const mainViewport = document.querySelector(
      '#landing-page-scroll > [data-radix-scroll-area-viewport]',
    ) as HTMLElement | undefined;

    if (!isContainerFillingScreen && mainViewport) {
      mainViewport.style.overflow = 'scroll';
      return;
    }

    if (currentSectionIndex !== previousSectionIndex) {
      const mainViewport = document.querySelector(
        '#landing-page-scroll > [data-radix-scroll-area-viewport]',
      ) as HTMLElement | undefined;
      if (mainViewport) {
        mainViewport.style.overflow = 'hidden';
        timeoutReference = setTimeout(() => {
          mainViewport.style.overflow = 'scroll';
        }, 1700);
      }
    }

    return () => {
      if (timeoutReference) {
        clearTimeout(timeoutReference);
      }
    };
  }, [currentSectionIndex, previousSectionIndex, isContainerFillingScreen]);

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
            actions={selectedSectionData.actions}
            activeOptionKey={selectedSectionData.defaultOptionKey}
            description={selectedSectionData.info.description}
            title={selectedSectionData.info.title}
            features={selectedSectionData.info.features}
            fadeOut={currentSectionIndex !== debouncedCurrentSectionIndex}
            animated
            animationDirection={animationDirection}
            animationStartIndex={animationStartIndex}
            animationEndIndex={animationEndIndex}
            animationImages={circleImages}
            animationFps={animationFps}
            placeholderImage={EXTENSION_CIRCLE_PLACEHOLDER}
          />
        </div>
        <div className="w-[0.5px]">
          <div
            ref={firstSectionAnchorReference}
            id="creators"
            className="my-10 h-screen"
          />
        </div>
      </div>
    </section>
  );
};
