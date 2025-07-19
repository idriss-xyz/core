import { classes } from '../../utils';

export const Card = ({
  className,
  ...properties
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classes('rounded-2xl bg-white p-4 shadow-sm', className)}
      {...properties}
    />
  );
};

export const CardHeader = ({
  className,
  ...properties
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={classes('text-heading6', className)} {...properties} />
  );
};

export const CardBody = ({
  className,
  ...properties
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classes('text-sm text-neutral-600', className)}
      {...properties}
    />
  );
};
