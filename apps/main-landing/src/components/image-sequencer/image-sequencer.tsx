'use client';
import { classes } from '@idriss-xyz/ui/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

type Properties = {
  images: string[];
  className?: string;
  direction?: 'forward' | 'backward';
  infinite?: boolean;
  startIndex?: number;
  endIndex?: number;
  width?: number;
  height?: number;
  fps?: number;
  onError?: (error: Error) => void;
  onLoad?: () => void;
};

const useImageLoader = (images: string[], onError?: (error: Error) => void) => {
  const [loadedImages, setLoadedImages] = useState<
    Map<number, HTMLImageElement>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const mountedReference = useRef(true);

  useEffect(() => {
    mountedReference.current = true;
    const imageMap = new Map<number, HTMLImageElement>();

    const loadImage = async (source: string, index: number) => {
      try {
        const img = new Image();
        img.src = source;

        await new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', () => {
            return reject(new Error(`Failed to load image: ${source}`));
          });
        });

        if (mountedReference.current) {
          imageMap.set(index, img);
          setLoadedImages(new Map(imageMap));
        }
      } catch (error) {
        if (mountedReference.current) {
          onError?.(error as Error);
        }
      }
    };

    const loadAllImages = async () => {
      setIsLoading(true);
      try {
        await Promise.all(
          images.map((source, index) => {
            return loadImage(source, index);
          }),
        );
      } finally {
        if (mountedReference.current) {
          setIsLoading(false);
        }
      }
    };

    void loadAllImages();

    return () => {
      mountedReference.current = false;
      imageMap.clear();
    };
  }, [images, onError]);

  return { loadedImages, isLoading };
};

const useAnimationFrame = (
  callback: () => void,
  fps: number,
  isEnabled: boolean,
) => {
  const requestReference = useRef<number>();
  const previousTimeReference = useRef<number>();
  const interval = 1000 / fps;

  const animate = useCallback(
    (time: number) => {
      if (!previousTimeReference.current) previousTimeReference.current = time;

      const delta = time - previousTimeReference.current;
      if (delta >= interval) {
        callback();
        previousTimeReference.current = time - (delta % interval);
      }

      requestReference.current = requestAnimationFrame(animate);
    },
    [callback, interval],
  );

  useEffect(() => {
    if (isEnabled) {
      requestReference.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestReference.current) {
        cancelAnimationFrame(requestReference.current);
      }
    };
  }, [animate, isEnabled]);
};

export const ImageSequencer = ({
  images,
  className,
  direction = 'forward',
  infinite = true,
  startIndex = 0,
  endIndex = images.length - 1,
  width = 2000,
  height = 2000,
  fps = 30,
  onError,
  onLoad,
}: Properties) => {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const contextReference = useRef<CanvasRenderingContext2D | null>(null);
  const [currentIndex, setCurrentIndex] = useState(() => {
    return Math.max(0, Math.min(startIndex, images.length - 1));
  });
  const { loadedImages, isLoading } = useImageLoader(images, onError);

  // Canvas context initialization
  useEffect(() => {
    if (canvasReference.current) {
      contextReference.current = canvasReference.current.getContext('2d');
      if (!contextReference.current) {
        onError?.(new Error('Failed to get canvas context'));
      }
    }
  }, []);

  const drawFrame = useCallback(() => {
    const context = contextReference.current;
    const currentImage = loadedImages.get(currentIndex);
    if (!context || !canvasReference.current || !currentImage) return;

    try {
      context.clearRect(
        0,
        0,
        canvasReference.current.width,
        canvasReference.current.height,
      );

      // Calculate scaling while preserving aspect ratio
      const scale = Math.min(
        canvasReference.current.width / currentImage.naturalWidth,
        canvasReference.current.height / currentImage.naturalHeight,
      );

      const x =
        (canvasReference.current.width - currentImage.naturalWidth * scale) / 2;
      const y =
        (canvasReference.current.height - currentImage.naturalHeight * scale) /
        2;

      context.drawImage(
        currentImage,
        x,
        y,
        currentImage.naturalWidth * scale,
        currentImage.naturalHeight * scale,
      );
    } catch (error) {
      onError?.(
        new Error(
          `Failed to draw frame: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }, [currentIndex, loadedImages, onError]);

  const updateFrame = useCallback(() => {
    setCurrentIndex((previous) => {
      if (infinite) {
        return direction === 'forward'
          ? (previous + 1) % images.length
          : previous > 0
            ? previous - 1
            : images.length - 1;
      }
      return direction === 'forward'
        ? Math.min(previous + 1, endIndex)
        : Math.max(previous - 1, startIndex);
    });
  }, [direction, endIndex, infinite, images.length, startIndex]);

  // Initial draw and resize handling
  useEffect(() => {
    drawFrame();
    const handleResize = () => {
      return drawFrame();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      return window.removeEventListener('resize', handleResize);
    };
  }, [drawFrame]);

  // Loading state handling
  useEffect(() => {
    if (!isLoading && onLoad) {
      onLoad();
    }
  }, [isLoading, onLoad]);

  useAnimationFrame(updateFrame, fps, !isLoading && images.length > 0);

  if (images.length === 0) return null;

  return (
    <canvas
      ref={canvasReference}
      width={width}
      height={height}
      className={classes('pointer-events-none', 'bg-transparent', className)}
    />
  );
};
