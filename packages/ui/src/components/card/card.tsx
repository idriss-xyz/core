import { classes } from '../../utils';

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classes('rounded-2xl bg-white p-4 shadow-sm', className)}
      {...props}
    />
  );
};

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classes('text-heading6', className)} {...props} />
);

export const CardBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classes('text-sm text-neutral-600', className)} {...props} />
);
