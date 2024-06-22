import { Button, ButtonProperties, classes } from 'shared/ui';

export const ActionButton = ({
  children,
  className,
  onClick,
  type,
  loading = false,
  disabled = false,
  // TODO: pick properties to avoid leaking unused properties
}: ButtonProperties) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={classes(
        'relative w-full rounded-lg bg-[#2D9CDB] font-medium text-white',
        className,
      )}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
