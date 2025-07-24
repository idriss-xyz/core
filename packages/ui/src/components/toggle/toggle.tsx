import { forwardRef } from 'react';

import { classes } from '../../utils';
import { Switch } from '../switch';

interface ToggleProperties {
  value: boolean;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: boolean) => void;
}

export const Toggle = forwardRef<HTMLDivElement, ToggleProperties>(
  (
    {
      value,
      label,
      sublabel,
      disabled,
      className,
      onChange,
      ...properties
    }: ToggleProperties,
    reference,
  ) => {
    return (
      <div
        className={classes('flex items-start gap-2', className)}
        ref={reference}
        {...properties}
      >
        <Switch value={value} onChange={onChange} disabled={disabled} />
        <div className="flex flex-col gap-0">
          {label && (
            <div className="flex items-center">
              <span className="text-body4 text-neutralGreen-900">{label}</span>
              {disabled && (
                <span className="ml-1.5 text-label6 tracking-tight text-mint-600">
                  Coming soon!
                </span>
              )}
            </div>
          )}
          {sublabel && (
            <span className="text-body5 text-neutral-600">{sublabel}</span>
          )}
        </div>
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';
