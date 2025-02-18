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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const imageMap = new Map<number, HTMLImageElement>();

    const loadImage = async (src: string, index: number) => {
      try {
        const img = new Image();
        img.src = src;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });

        if (mountedRef.current) {
          imageMap.set(index, img);
          setLoadedImages(new Map(imageMap));
        }
      } catch (error) {
        if (mountedRef.current) {
          onError?.(error as Error);
        }
      }
    };

    const loadAllImages = async () => {
      setIsLoading(true);
      try {
        await Promise.all(images.map((src, index) => loadImage(src, index)));
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadAllImages();

    return () => {
      mountedRef.current = false;
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
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const interval = 1000 / fps;

  const animate = useCallback(
    (time: number) => {
      if (!previousTimeRef.current) previousTimeRef.current = time;

      const delta = time - previousTimeRef.current;
      if (delta >= interval) {
        callback();
        previousTimeRef.current = time - (delta % interval);
      }

      requestRef.current = requestAnimationFrame(animate);
    },
    [callback, interval],
  );

  useEffect(() => {
    if (isEnabled) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(0, Math.min(startIndex, images.length - 1)),
  );
  const { loadedImages, isLoading } = useImageLoader(images, onError);

  // Canvas context initialization
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
      if (!ctxRef.current) {
        onError?.(new Error('Failed to get canvas context'));
      }
    }
  }, []);

  const drawFrame = useCallback(() => {
    const ctx = ctxRef.current;
    const currentImage = loadedImages.get(currentIndex);
    if (!ctx || !canvasRef.current || !currentImage) return;

    try {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Calculate scaling while preserving aspect ratio
      const scale = Math.min(
        canvasRef.current.width / currentImage.naturalWidth,
        canvasRef.current.height / currentImage.naturalHeight,
      );

      const x =
        (canvasRef.current.width - currentImage.naturalWidth * scale) / 2;
      const y =
        (canvasRef.current.height - currentImage.naturalHeight * scale) / 2;

      ctx.drawImage(
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
    setCurrentIndex((prev) => {
      if (infinite) {
        return direction === 'forward'
          ? (prev + 1) % images.length
          : prev > 0
            ? prev - 1
            : images.length - 1;
      }
      return direction === 'forward'
        ? Math.min(prev + 1, endIndex)
        : Math.max(prev - 1, startIndex);
    });
  }, [direction, endIndex, infinite, images.length, startIndex]);

  // Initial draw and resize handling
  useEffect(() => {
    drawFrame();
    const handleResize = () => drawFrame();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      ref={canvasRef}
      width={width}
      height={height}
      className={classes('pointer-events-none', 'bg-transparent', className)}
    />
  );
};
