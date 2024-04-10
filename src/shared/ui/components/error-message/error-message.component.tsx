import { classes } from 'shared/ui/utils';

import { ErrorMessageProperties } from './error-message.types';

export const ErrorMessage = ({
  children,
  className,
}: ErrorMessageProperties) => {
  return (
    <p className={classes('text-sm text-red-500', className)}>{children}</p>
  );
};
