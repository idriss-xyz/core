import { useEffect, useState } from 'react';

import { TextureData } from './types';
import { loadImage } from './image-loader';
import { configureTexture, getImageDimensions } from './texture-utils';

const createTextureFromImage = async (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  imageUrl: string,
): Promise<TextureData> => {
  const imageSource = await loadImage(imageUrl);
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Unable to create texture');
  }

  configureTexture(gl, texture, imageSource);
  const { width, height } = getImageDimensions(imageSource);

  return { texture, width, height };
};

const loadImagesWithConcurrency = async (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  images: string[],
  concurrencyLimit = 30,
  onError?: (error: Error) => void,
): Promise<Map<number, TextureData>> => {
  const textureMap = new Map<number, TextureData>();
  let index = 0;

  const loadNext = async () => {
    while (index < images.length) {
      const currentIndex = index++;
      try {
        if (!images[currentIndex]) {
          continue;
        }
        const textureData = await createTextureFromImage(
          gl,
          images[currentIndex],
        );
        textureMap.set(currentIndex, textureData);
      } catch (error) {
        onError?.(error as Error);
      }
      await new Promise((resolve) => {
        return setTimeout(resolve, 0);
      });
    }
  };

  const loaders = Array.from({ length: concurrencyLimit })
    .fill(null)
    .map(() => {
      return loadNext();
    });

  await Promise.all(loaders);
  return textureMap;
};

export const useTextureLoader = (
  gl: WebGLRenderingContext | WebGL2RenderingContext | null,
  images: string[],
  placeholderImage: string,
  onError?: (error: Error) => void,
) => {
  const [textures, setTextures] = useState<Map<number, TextureData>>(new Map());
  const [placeholderTexture, setPlaceholderTexture] =
    useState<TextureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load placeholder image
  useEffect(() => {
    if (!gl) {
      return;
    }

    const loadPlaceholder = async () => {
      try {
        const textureData = await createTextureFromImage(gl, placeholderImage);
        setPlaceholderTexture(textureData);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    void loadPlaceholder();
  }, [gl, placeholderImage, onError]);

  // Load all other images
  useEffect(() => {
    if (!gl || !placeholderTexture) {
      return;
    }
    let cancelled = false;

    const loadImages = async () => {
      const textureMap = await loadImagesWithConcurrency(
        gl,
        images,
        30,
        onError,
      );

      if (!cancelled) {
        setTextures(new Map(textureMap));
        setIsLoading(false);
      }
    };

    void loadImages();

    return () => {
      cancelled = true;
      for (const data of textures.values()) {
        gl.deleteTexture(data.texture);
      }
    };
    // adding textures to the dep array will cause refetch on each render
  }, [gl, images, onError, placeholderTexture]);

  return { textures, placeholderTexture, isLoading };
};
