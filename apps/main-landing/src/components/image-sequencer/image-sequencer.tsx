'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SequencerProps, TextureData } from './types';
import { initWebGL } from './web-gl-utils';
import { useTextureLoader } from './use-texture-loader';

export const ImageSequencer = ({
  images,
  placeholderImage,
  width = 2000,
  height = 2000,
  fps = 30,
  direction = 'forward',
  infinite = true,
  startIndex = 0,
  endIndex = images.length - 1,
  className = '',
  onLoad,
  onError,
}: SequencerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    program: WebGLProgram;
    posBuffer: WebGLBuffer;
  } | null>(null);
  const currentIndexRef = useRef<number>(
    Math.max(0, Math.min(startIndex, images.length - 1)),
  );
  const animationFrameRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const frameInterval = 1000 / fps;
  const [glInitialized, setGlInitialized] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      glRef.current = initWebGL(canvasRef.current);
      setGlInitialized(true);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError]);

  const { textures, placeholderTexture, isLoading } = useTextureLoader(
    glRef.current?.gl || null,
    images,
    placeholderImage,
    onError,
  );

  const updateQuadVertices = useCallback((textureData: TextureData) => {
    const gl = glRef.current?.gl;
    const posBuffer = glRef.current?.posBuffer;
    const canvas = canvasRef.current;
    if (!gl || !posBuffer || !canvas) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = textureData.width;
    const ih = textureData.height;
    const scale = Math.min(cw / iw, ch / ih);
    const drawW = iw * scale;
    const drawH = ih * scale;
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    const left = (offsetX / cw) * 2 - 1;
    const right = ((offsetX + drawW) / cw) * 2 - 1;
    const top = 1 - (offsetY / ch) * 2;
    const bottom = 1 - ((offsetY + drawH) / ch) * 2;

    const vertices = new Float32Array([
      left,
      bottom,
      right,
      bottom,
      left,
      top,
      right,
      top,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  }, []);

  const drawFrame = useCallback(() => {
    const gl = glRef.current?.gl;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const textureData = isLoading
      ? placeholderTexture
      : textures.get(currentIndexRef.current);
    if (!textureData) return;

    updateQuadVertices(textureData);
    gl.bindTexture(gl.TEXTURE_2D, textureData.texture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [textures, isLoading, placeholderTexture, updateQuadVertices]);

  const updateIndex = useCallback(() => {
    if (isLoading) return;
    const current = currentIndexRef.current;
    let next = current;
    if (infinite) {
      next =
        direction === 'forward'
          ? (current + 1) % images.length
          : (current - 1 + images.length) % images.length;
    } else {
      next =
        direction === 'forward'
          ? Math.min(current + 1, endIndex)
          : Math.max(current - 1, startIndex);
    }
    currentIndexRef.current = next;
  }, [direction, images.length, infinite, startIndex, endIndex, isLoading]);

  useEffect(() => {
    if (!glInitialized || !placeholderTexture) return;

    const animate = (time: number) => {
      if (!previousTimeRef.current) previousTimeRef.current = time;
      const delta = time - previousTimeRef.current;
      if (delta >= frameInterval) {
        updateIndex();
        drawFrame();
        previousTimeRef.current = time - (delta % frameInterval);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [
    glInitialized,
    placeholderTexture,
    frameInterval,
    updateIndex,
    drawFrame,
  ]);

  useEffect(() => {
    const gl = glRef.current?.gl;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;
    const handleResize = () => {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, canvas.width, canvas.height);
      drawFrame();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height, drawFrame]);

  useEffect(() => {
    if (!isLoading && onLoad) onLoad();
  }, [isLoading, onLoad]);

  if (images.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  );
};
