import { Button, ButtonProperties } from 'shared/ui';

export const NavigationButton = ({
  children,
  disabled,
  onClick,
}: ButtonProperties) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-7 select-none items-center justify-center rounded-md text-sm font-light text-[#444444] transition-all hover:text-[#7d848a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-white"
    >
      {children}
    </Button>
  );
};
