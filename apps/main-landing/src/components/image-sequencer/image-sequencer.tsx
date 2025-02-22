'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

type SequencerProps = {
  images: string[];
  placeholderImage: string;
  width?: number;
  height?: number;
  fps?: number;
  direction?: 'forward' | 'backward';
  infinite?: boolean;
  startIndex?: number;
  endIndex?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
};

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(u_image, v_texCoord);
  }
`;

function createShader(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Could not compile shader: ' + info);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Unable to create program');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Could not link program: ' + info);
  }
  return program;
}

// Robust WebGL initialization with fallback: try WebGL2 then fall back to WebGL1.
function initWebGL(canvas: HTMLCanvasElement) {
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', {
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    // ignore errors here
  }
  if (!gl) {
    gl = canvas.getContext('webgl', {
      antialias: false,
      preserveDrawingBuffer: false,
    });
  }
  if (!gl) throw new Error('WebGL is not supported in this browser.');

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  // Create position and texture coordinate buffers
  const posBuffer = gl.createBuffer();
  if (!posBuffer) throw new Error('Unable to create position buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.DYNAMIC_DRAW,
  );

  const texBuffer = gl.createBuffer();
  if (!texBuffer) throw new Error('Unable to create texture buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]),
    gl.STATIC_DRAW,
  );

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const texLoc = gl.getAttribLocation(program, 'a_texCoord');
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.enableVertexAttribArray(texLoc);
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

  return { gl, program, posBuffer };
}

type TextureData = { texture: WebGLTexture; width: number; height: number };

// Utility to load an image robustly. Uses createImageBitmap when available,
// otherwise falls back to loading an HTMLImageElement.
async function loadImage(url: string): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } else {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image: ' + url));
      img.src = url;
    });
  }
}

const useTextureLoader = (
  gl: WebGLRenderingContext | WebGL2RenderingContext | null,
  images: string[],
  placeholderImage: string,
  onError?: (error: Error) => void,
) => {
  const [textures, setTextures] = useState<Map<number, TextureData>>(new Map());
  const [placeholderTexture, setPlaceholderTexture] = useState<TextureData | null>(null);
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
          imageSource.close && imageSource.close();
        } else {
          width = imageSource.naturalWidth;
          height = imageSource.naturalHeight;
        }
        setPlaceholderTexture({ texture, width, height });
      } catch (error) {
        onError?.(error as Error);
      }
    };
    loadPlaceholder();
  }, [gl, placeholderImage, onError]);

  // Load all other images.
  useEffect(() => {
    if (!gl || !placeholderTexture) return;
    let cancelled = false;
    const textureMap = new Map<number, TextureData>();

    const loadImageTexture = async (i: number) => {
      try {
        if (!images[i]) return;
        const imageSource = await loadImage(images[i]);
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
          imageSource.close && imageSource.close();
        } else {
          width = imageSource.naturalWidth;
          height = imageSource.naturalHeight;
        }
        textureMap.set(i, { texture, width, height });
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
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      };

      const loaders = [];
      for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
        loaders.push(loadNext());
      }

      await Promise.all(loaders);
      if (!cancelled) {
        setTextures(new Map(textureMap));
        setIsLoading(false);
      }
    };

    loadAllImages();

    return () => {
      cancelled = true;
      textureMap.forEach((data) => gl.deleteTexture(data.texture));
      textureMap.clear();
    };
  }, [gl, images, onError, placeholderTexture]);

  return { textures, placeholderTexture, isLoading };
};

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

    const vertices = new Float32Array([left, bottom, right, bottom, left, top, right, top]);
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
      next = direction === 'forward'
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;
    } else {
      next = direction === 'forward'
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
  }, [glInitialized, placeholderTexture, frameInterval, updateIndex, drawFrame]);

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
