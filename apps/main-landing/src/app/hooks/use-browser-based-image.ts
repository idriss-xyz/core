'use client';

import { useState, useEffect } from 'react';

const isAppleBrowser = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined')
    return false;

  const ua = navigator.userAgent;

  return (
    /Macintosh|iPhone|iPad|iPod/.test(ua) &&
    ua.includes('Safari') &&
    !/Chrome|CriOS|FxiOS/.test(ua)
  );
};

export function useBrowserBasedImage({
  svgSrc,
  pngSrc,
}: {
  svgSrc: string;
  pngSrc: string;
}) {
  const [imageSrc, setImageSrc] = useState(svgSrc);

  useEffect(() => {
    if (isAppleBrowser()) {
      setImageSrc(pngSrc);
    }
  }, [pngSrc]);

  return imageSrc;
}
