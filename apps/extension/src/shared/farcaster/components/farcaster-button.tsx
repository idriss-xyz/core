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
      className={classes('bg-[#8A63D2] hover:bg-[#7554B3]', className)}
      title={title}
    >
      {children}
    </Button>
  );
};
