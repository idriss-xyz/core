import { classes } from '../../utils';

import { InputBaseLabelProperties } from './input-base.types';

export const InputBaseLabel = ({
  label,
  className,
}: InputBaseLabelProperties) => {
  return (
    <span
      className={classes(
        'text-base font-semibold leading-tight text-white',
        className,
      )}
    >
      {label}
    </span>
  );
};
