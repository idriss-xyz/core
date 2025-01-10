import { ReactElement, useEffect, useState } from 'react';

import { classes } from 'shared/ui/utils';

interface ImageProperties {
  avatarImage: string | null;
  /** The fallback component will be displayed during image loading and as a fallback if fetching the image fails */
  fallbackComponent?: ReactElement;
  className?: string;
}

export const PreloadedImage = ({
  avatarImage,
  className,
  fallbackComponent,
}: ImageProperties) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    if (avatarImage) {
      const img = new Image();
      img.addEventListener('load', () => {
        setImageLoaded(true);
      });
      img.src = avatarImage;
    }
  }, [avatarImage]);

  return avatarImage && imageLoaded ? (
    <img src={avatarImage} className={className} alt="" />
  ) : (
    (fallbackComponent ?? (
      <div
        className={classes(
          className,
          'bg-[linear-gradient(135deg,_#ffffff_0%,_#d0d0d0_100%)]',
        )}
      />
    ))
  );
};
