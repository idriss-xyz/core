import { forwardRef, ReactNode } from 'react';

import { classes } from '../../utils';
import { Switch } from '../switch';

interface ToggleProperties {
  value: boolean;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
  switchClassname?: string;
  comingSoon?: boolean;
  children?: ReactNode;
  onChange: (value: boolean) => void;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProperties>(
  (
    {
      value,
      label,
      sublabel,
      disabled,
      comingSoon = false,
      className,
      switchClassname,
      children,
      onChange,
      ...properties
    }: ToggleProperties,
    reference,
  ) => {
    return (
      <div
        className={classes('flex items-start gap-2', className)}
        {...properties}
      >
        <Switch
          value={value}
          onChange={onChange}
          disabled={disabled}
          ref={reference}
          className={switchClassname}
        />
        <div className="flex flex-col gap-0">
          {label && (
            <div className="flex items-center">
              <span className="text-body4 text-neutralGreen-900">{label}</span>
              {comingSoon && (
                <span className="ml-1.5 text-label6 tracking-tight text-mint-600">
                  Coming soon!
                </span>
              )}
            </div>
          )}
          {sublabel && (
            <span className="text-body5 text-neutral-600">{sublabel}</span>
          )}
          {children && <div>{children}</div>}
        </div>
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';
