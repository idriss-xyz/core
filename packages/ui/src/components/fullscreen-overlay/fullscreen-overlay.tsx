'use client';
import { ReactNode } from 'react';

import { GradientBorder } from '../gradient-border';
import { classes } from '../../utils';

export interface FullscreenOverlayProperties {
  children: ReactNode;
  className?: string;
  backgroundImage?: ReactNode;
  onClose?: () => void;
  hideAboveClass?: string;
}

export const FullscreenOverlay = ({
  children,
  className,
  backgroundImage,
  onClose,
  hideAboveClass = '',
}: FullscreenOverlayProperties) => {
  return (
    <main
      className={classes(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4',
        hideAboveClass,
      )}
      onClick={onClose}
    >
      <div className={classes('absolute inset-0', className)} />
      {backgroundImage}
      <div
        className="relative z-[5] m-auto flex items-center justify-center rounded-[24px] bg-white/50 p-4"
        onClick={(event_) => {
          return event_.stopPropagation();
        }}
      >
        <GradientBorder
          borderWidth={1}
          gradientDirection="toTop"
          gradientStopColor="#91CE9A80"
        />
        <div className="relative flex flex-col items-center justify-center rounded-[16px] bg-white/[.80] px-4 py-11">
          <GradientBorder
            borderRadius={16}
            borderWidth={2}
            gradientDirection="toBottom"
            gradientStartColor="#ffffff"
            gradientStopColor="rgba(145, 206, 154)"
          />
          {children}
        </div>
      </div>
    </main>
  );
};
