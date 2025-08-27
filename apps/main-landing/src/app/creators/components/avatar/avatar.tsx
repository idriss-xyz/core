import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

type AvatarProperties = {
  src?: string;
  size?: number;
  className?: string;
};

export const Avatar: React.FC<AvatarProperties> = ({
  src,
  size = 48,
  className,
}) => {
  const [error, setError] = useState(false);

  const showFallback = !src || error;

  return (
    <div
      style={{ width: size, height: size }}
      className={classes('relative', className)}
    >
      {showFallback ? (
        <div
          className={classes(
            'flex items-center justify-center rounded-full border border-neutral-300 bg-neutral-200',
            className,
          )}
          style={{ width: size, height: size }}
        >
          <Icon name="UserRound" size={20} className="text-neutral-500" />
        </div>
      ) : (
        <Image
          src={src}
          alt="avatar"
          className="rounded-full border border-neutral-300 object-cover"
          style={{ width: size, height: size }}
          onError={() => {
            return setError(true);
          }}
          height={size}
          width={size}
        />
      )}
    </div>
  );
};
