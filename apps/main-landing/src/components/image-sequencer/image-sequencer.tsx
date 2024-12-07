'use client';

import { classes } from '@idriss-xyz/ui/utils';
import { useEffect, useRef, useState } from 'react';

type Properties = {
  images: string[];
  className?: string;
  direction?: 'forward' | 'backward';
  infinite?: boolean;
  startIndex?: number;
  endIndex?: number;
};

const preloadImages = async (images: string[]) => {
  return await Promise.all(
    images.map((source) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = source;
        img.addEventListener('load', () => {
          return resolve(img);
        });
        img.addEventListener('error', () => {
          return reject(new Error('cannot preload image'));
        });
      });
    }),
  );
};

export const ImageSequencer = ({
  images,
  className,
  direction = 'forward',
  infinite = true,
  startIndex = 0,
  endIndex = images.length - 1,
}: Properties) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const hasFirstImage = loadedImages.length > 0;
  const isLoaded = loadedImages.length === images.length;
  const intervalReference = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const run = async () => {
      const [firstImage] = images;
      const v = await preloadImages([firstImage!]);
      setLoadedImages(v);
    };
    void run();
  }, [images, direction]);

  useEffect(() => {
    if (isLoaded || !hasFirstImage) {
      return;
    }

    const run = async () => {
      const [_firstImage, ...restImages] = images;
      const v = await preloadImages(restImages);
      setLoadedImages((previous) => {
        return [...previous, ...v];
      });
    };

    void run();
  }, [hasFirstImage, images, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const frameInterval = 1000 / 30; // 30 FPS

    intervalReference.current = setInterval(() => {
      if (infinite) {
        setCurrentIndex((previousIndex) => {
          if (direction === 'forward') {
            return (previousIndex + 1) % images.length;
          } else {
            return previousIndex > 0 ? previousIndex - 1 : images.length - 1;
          }
        });
      } else {
        setCurrentIndex((previousIndex) => {
          if (direction === 'forward') {
            return previousIndex < endIndex ? previousIndex + 1 : previousIndex;
          } else {
            return previousIndex > startIndex
              ? previousIndex - 1
              : previousIndex;
          }
        });
      }
    }, frameInterval);

    return () => {
      if (intervalReference.current) {
        clearInterval(intervalReference.current);
      }
    };
  }, [images.length, isLoaded, direction, endIndex, infinite, startIndex]);

  if (!hasFirstImage) {
    return null;
  }

  return (
    <img
      src={isLoaded ? loadedImages[currentIndex]!.src : loadedImages[0]!.src}
      className={classes('pointer-events-none', className)}
      alt="Animated Sequence"
    />
  );
};
