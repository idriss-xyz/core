import { Button, ButtonProperties, classes } from 'shared/ui';

type Properties = Pick<
  ButtonProperties,
  'children' | 'className' | 'onClick' | 'type' | 'loading' | 'disabled'
>;

export const ActionButton = ({
  children,
  className,
  onClick,
  type,
  loading = false,
  disabled = false,
}: Properties) => {
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
