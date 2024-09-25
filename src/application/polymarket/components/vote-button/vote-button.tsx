import { Button, ButtonProperties, classes } from 'shared/ui';

interface Properties
  extends Pick<
    ButtonProperties,
    'onClick' | 'disabled' | 'children' | 'className'
  > {
  isActive: boolean;
  tokenIndex: number;
}

export const VoteButton = ({
  onClick,
  className,
  children,
  isActive,
  tokenIndex,
  disabled = false,
}: Properties) => {
  return (
    <Button
      className={classes(
        'rounded-lg bg-[#2C3F4F] py-4 font-semibold text-[#858D92]',
        isActive && 'text-white',
        isActive && tokenIndex === 0 && 'bg-[#27AE60]',
        isActive && tokenIndex === 1 && 'bg-[#E64800]',

        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
