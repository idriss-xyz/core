import { useCallback, useEffect, useRef } from 'react';

interface Properties {
  onClick?: () => void;
  onHover?: () => void;
  hoverActionDelay?: number;
}

export const Backdrop = ({
  onClick,
  onHover,
  hoverActionDelay = 0,
}: Properties) => {
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

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
      className="fixed inset-0 bg-transparent"
      onClick={onClick}
      onMouseEnter={startHover}
      onMouseOut={stopHover}
    />
  );
};
