import { classes } from '@idriss-xyz/ui/utils';

type TopWaveProperties = {
  className?: string;
};

export const TopWave = ({ className }: TopWaveProperties) => {
  return (
    <svg
      className={classes('pointer-events-none', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1980 818"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2344 301C2344 134.762 1737.79 0 990 0C242.206 0 -364 134.762 -364 301V1696H2344V301Z"
        fill="#FAFFF5"
      />
    </svg>
  );
};
