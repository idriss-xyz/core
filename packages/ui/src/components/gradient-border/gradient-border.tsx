import { useId } from 'react';

import { classes } from '@idriss-xyz/ui/utils';

type GradientBorderProperties = {
  /** value in px */
  borderRadius?: number;
  /** value in px */
  borderWidth?: number;
  gradientDirection: 'toTop' | 'toBottom';
  gradientStartColor?: string;
  gradientStopColor?: string;
  className?: string;
};

/** The parent element should be positioned relative to ensure the border is placed correctly. */
export const GradientBorder = ({
  borderRadius = 24,
  borderWidth = 2,
  gradientDirection,
  gradientStartColor = '#5FEB3C',
  gradientStopColor = 'rgba(255,255,255,0)',
  className,
}: GradientBorderProperties) => {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classes(
        'pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible',
        className,
      )}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1={gradientDirection === 'toTop' ? '100%' : '0%'}
          x2="0%"
          y2={gradientDirection === 'toTop' ? '0%' : '100%'}
        >
          <stop offset="0%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={borderRadius}
        ry={borderRadius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={borderWidth}
      />
    </svg>
  );
};

export const RadialGradientBorder = () => {
  return (
    <svg
      fill="none"
      className="pointer-events-none absolute left-0 top-0 size-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x=".5"
        y=".5"
        width="100%"
        height="100%"
        rx="15.5"
        stroke="url(#a)"
      />
      <defs>
        <radialGradient
          id="a"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(31.402 30.574 108.762) scale(274.477 246.185)"
        >
          <stop stopColor="#E7F5E7" />
          <stop offset="1" stopColor="#76C282" />
        </radialGradient>
      </defs>
    </svg>
  );
};
