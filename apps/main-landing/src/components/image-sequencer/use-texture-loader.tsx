import { useEffect, useState } from 'react';

import { TextureData } from './types';
import { loadImage } from './image-loader';

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

  // Load placeholder image first.
  useEffect(() => {
    if (!gl) return;
    const loadPlaceholder = async () => {
      try {
        const imageSource = await loadImage(placeholderImage);
        const texture = gl.createTexture();
        if (!texture) throw new Error('Unable to create texture');

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          imageSource,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        let width, height;
        if (imageSource instanceof ImageBitmap) {
          width = imageSource.width;
          height = imageSource.height;
          if (imageSource.close) {
            imageSource.close();
          }
        } else {
          width = imageSource.naturalWidth;
          height = imageSource.naturalHeight;
        }
        setPlaceholderTexture({ texture, width, height });
      } catch (error) {
        onError?.(error as Error);
      }
    };
    void loadPlaceholder();
  }, [gl, placeholderImage, onError]);

  // Load all other images.
  useEffect(() => {
    if (!gl || !placeholderTexture) return;
    let cancelled = false;
    const textureMap = new Map<number, TextureData>();

    const loadImageTexture = async (index: number) => {
      try {
        if (!images[index]) return;
        const imageSource = await loadImage(images[index]);
        const texture = gl.createTexture();
        if (!texture) throw new Error('Unable to create texture');

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          imageSource,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        let width, height;
        if (imageSource instanceof ImageBitmap) {
          width = imageSource.width;
          height = imageSource.height;
          if (imageSource.close) {
            imageSource.close();
          }
        } else {
          width = imageSource.naturalWidth;
          height = imageSource.naturalHeight;
        }
        textureMap.set(index, { texture, width, height });
      } catch (error) {
        onError?.(error as Error);
      }
    };

    const loadAllImages = async () => {
      const CONCURRENCY_LIMIT = 30;
      let index = 0;

      const loadNext = async () => {
        while (index < images.length) {
          const currentIndex = index++;
          await loadImageTexture(currentIndex);
          await new Promise((resolve) => {
            return setTimeout(resolve, 0);
          });
        }
      };

      const loaders = [];
      for (let index_ = 0; index_ < CONCURRENCY_LIMIT; index_++) {
        loaders.push(loadNext());
      }

      await Promise.all(loaders);
      if (!cancelled) {
        setTextures(new Map(textureMap));
        setIsLoading(false);
      }
    };

    void loadAllImages();

    return () => {
      cancelled = true;
      for (const data of textureMap.values()) {
        gl.deleteTexture(data.texture);
      }
      textureMap.clear();
    };
  }, [gl, images, onError, placeholderTexture]);

  return { textures, placeholderTexture, isLoading };
};
