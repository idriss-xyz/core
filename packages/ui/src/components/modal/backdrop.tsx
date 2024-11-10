import { useCallback, useEffect, useRef } from 'react';

import { classes } from '../../utils';

interface Properties {
  onClick?: () => void;
  onHover?: () => void;
  hoverActionDelay?: number;
  className?: string;
}

export const Backdrop = ({
  onClick,
  onHover,
  className,
  hoverActionDelay = 0,
}: Properties) => {
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHover = useCallback(() => {
    hoverTimer.current = setTimeout(() => {
      onHover?.();
    }, hoverActionDelay);
  }, [hoverActionDelay, onHover]);

  const stopHover = useCallback(() => {
    clearTimeout(hoverTimer.current ?? undefined);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimer.current ?? undefined);
    };
  }, []);

  return (
    <div
      className={classes('fixed inset-0 bg-neutral-400/60', className)}
      onClick={onClick}
      onMouseEnter={startHover}
      onMouseOut={stopHover}
    />
  );
};
