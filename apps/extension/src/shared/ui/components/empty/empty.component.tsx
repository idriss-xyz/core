import { classes } from 'shared/ui/utils';

interface EmptyProperties {
  text?: string;
  className?: string;
}

export const Empty = ({ text, className }: EmptyProperties) => {
  return (
    <div
      className={classes(
        'flex select-none flex-col items-center justify-center opacity-30',
        className,
      )}
    >
      <svg
        width="100"
        height="75"
        viewBox="0 0 100 80"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#B0FFB0', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#4CAF50', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d="M10,30 L25,5 L75,5 L90,30 L90,70 L10,70 Z"
          fill="url(#grad1)"
          stroke="#007A33"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10,30 L25,30 L30,45 L70,45 L75,30 L90,30 L90,70 L10,70 Z"
          fill="none"
          stroke="#007A33"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-medium text-[B0FFB0]">{text}</span>
    </div>
  );
};
