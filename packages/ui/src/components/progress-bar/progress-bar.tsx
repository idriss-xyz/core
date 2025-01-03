import * as Progress from '@radix-ui/react-progress';

import { classes } from '../../utils';

type Properties = {
  progress: number;
  className?: string;
  indicatorClassName?: string;
};

export const ProgressBar = ({
  progress,
  className,
  indicatorClassName,
}: Properties) => {
  return (
    <div className="size-full">
      <div className="flex justify-end" style={{ width: `${progress}%` }}>
        <span className="translate-x-1/2 text-body4 text-neutral-800 lg:text-body2">
          {progress}%
        </span>
      </div>
      <Progress.Root
        className={classes(
          'relative h-[25px] w-[300px] overflow-hidden rounded-full bg-black',
          className,
        )}
        style={{
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: 'translateZ(0)',
        }}
        value={progress}
      >
        <Progress.Indicator
          className={classes(
            'ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-white transition-transform duration-[660ms]',
            indicatorClassName,
          )}
          style={{ width: `${progress}%` }}
        />
      </Progress.Root>
    </div>
  );
};
