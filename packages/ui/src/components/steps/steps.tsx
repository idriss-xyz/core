import { classes } from '../../utils';

type Step = {
  step: string;
  title: string;
};

type Properties = {
  steps: Step[];
  activeStepIndex: number;
  className?: string;
};

export const Steps = ({ steps, activeStepIndex, className }: Properties) => {
  return (
    <div
      className={classes('flex w-full items-center justify-between', className)}
    >
      {steps.map((step, index) => {return (
        <div
          className={classes(
            'flex items-center',
            index < steps.length - 1 && 'flex-grow',
          )}
          key={index}
        >
          <div
            className={classes(
              'flex min-w-6 items-center justify-center rounded bg-neutral-400 px-1 text-center text-label6 text-neutral-300',
              activeStepIndex === index && 'bg-neutral-900 text-white',
            )}
          >
            {step.step}
          </div>
          <span
            className={classes(
              'ml-2 text-body4 text-neutral-600',
              activeStepIndex === index && 'ml-2 text-body4 text-neutral-900',
            )}
          >
            {step.title}
          </span>

          {index < steps.length - 1 && (
            <div className="mx-4 h-px grow bg-neutral-500" />
          )}
        </div>
      )})}
    </div>
  );
};
