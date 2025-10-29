import * as Progress from '@radix-ui/react-progress';

type Properties = {
  progress: number;
};

export const ProgressBarV2 = ({ progress }: Properties) => {
  return (
    <Progress.Root
      value={progress}
      className="relative size-full overflow-hidden rounded-full bg-gray-200"
    >
      <Progress.Indicator
        className="block h-full rounded-full bg-mint-400 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </Progress.Root>
  );
};
