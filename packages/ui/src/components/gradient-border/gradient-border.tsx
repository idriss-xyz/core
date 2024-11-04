import { classes } from '@idriss-xyz/ui/utils';

type GradientBorderProperties = {
  /** value in px */
  borderRadius?: number;
  className?: string;
};

export const GradientBorder = ({
  borderRadius = 24,
  className,
}: GradientBorderProperties) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classes(
        'pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible',
        className,
      )}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#5FEB3C" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
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
        stroke="url('#gradient')"
        strokeWidth="2"
      />
    </svg>
  );
};
