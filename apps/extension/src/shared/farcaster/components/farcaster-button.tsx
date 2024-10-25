import { ReactNode } from 'react';

import { Button, classes } from 'shared/ui';

type Properties = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
};

export const FarcasterButton = ({
  children,
  onClick,
  className,
  title,
}: Properties) => {
  return (
    <Button
      onClick={onClick}
      className={classes(
        'bg-farcaster-primary-400 hover:bg-farcaster-primary-500',
        className,
      )}
      title={title}
    >
      {children}
    </Button>
  );
};
