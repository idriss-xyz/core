import { classes } from '../../utils';

import { ErrorMessageProperties } from './error-message.types';

export const ErrorMessage = ({
  children,
  className,
}: ErrorMessageProperties) => {
  return (
    <p className={classes('text-sm text-[#ef4444]', className)}>{children}</p>
  );
};
