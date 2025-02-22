export async function loadImage(
  url: string,
): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } else {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.addEventListener('load', () => {
        return resolve(img);
      });
      img.addEventListener('error', () => {
        return reject(new Error('Failed to load image: ' + url));
      });
      img.src = url;
    });
  }
}
