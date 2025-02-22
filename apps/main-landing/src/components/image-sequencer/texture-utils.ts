export const configureTexture = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  texture: WebGLTexture,
  imageSource: ImageBitmap | HTMLImageElement,
) => {
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
};

export const getImageDimensions = (
  imageSource: ImageBitmap | HTMLImageElement,
) => {
  if (imageSource instanceof ImageBitmap) {
    const { width, height } = imageSource;
    imageSource.close?.();
    return { width, height };
  }
  return {
    width: imageSource.naturalWidth,
    height: imageSource.naturalHeight,
  };
};
