export type SequencerProps = {
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

export type TextureData = {
  texture: WebGLTexture;
  width: number;
  height: number;
};
