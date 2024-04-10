import { ProgressProperties } from './progress.types';

export const Progress = ({ value }: ProgressProperties) => {
  const normalisedValue = Math.min(Math.max(0, value), 1);

  return (
    <div className="relative">
      <svg
        width="58"
        height="29"
        viewBox="-29 -29 58 29"
        className="max-w-[58px] overflow-visible"
      >
        <path
          stroke="#858D92"
          strokeWidth="4"
          strokeLinecap="butt"
          fill="none"
          d="M -29.001 3.5514757175273244e-15 A 29 29 0 1 1 29 -7.102951435054649e-15"
        />
        <path
          className={value < 0.5 ? 'stroke-[#E64800]' : 'stroke-[#27AE60]'}
          strokeWidth="4"
          strokeLinecap="butt"
          fill="none"
          d="M -29.001 3.5514757175273244e-15 A 29 29 0 1 1 29 -7.102951435054649e-15"
          pathLength={100}
          strokeDasharray={`${normalisedValue * 100} 100`}
          strokeOpacity={0.8}
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 flex-col text-center">
        <span className="text-base font-medium leading-none">
          {(normalisedValue * 100).toFixed(2)}%
        </span>
        <span className="text-xs leading-none opacity-50">chance</span>
      </div>
    </div>
  );
};
