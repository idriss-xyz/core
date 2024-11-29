import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';

import { classes } from '../../../utils';
import { Icon } from '../../icon';
import { MultiselectOption } from '../types';

type Properties<T> = HTMLAttributes<HTMLDivElement> &
  DropdownMenuTriggerProps & {
    selectedOptions: MultiselectOption<T>[];
    trimDisplayedOptions?: number;
    placeholder?: string;
    showOptionIconOnly?: boolean;
    className?: string;
    label?: string;
    renderLabel?: () => ReactNode;
    helperText?: string;
    error?: boolean;
  };

const _MultiselectInput = <T,>(
  properties: Properties<T>,
  reference: React.Ref<HTMLDivElement>,
) => {
  const {
    selectedOptions,
    trimDisplayedOptions,
    placeholder,
    showOptionIconOnly,
    className,
    onClick,
    onKeyDown,
    renderLabel,
    label,
    helperText,
    error,
    ...rest
  } = properties;

  const displayedOptions = trimDisplayedOptions
    ? selectedOptions.slice(0, trimDisplayedOptions)
    : selectedOptions;

  return (
    <div className={className}>
      {renderLabel ? (
        renderLabel()
      ) : label ? (
        <p className="mb-2 text-label5 text-neutral-700 lg:text-label4">
          {label}
        </p>
      ) : null}
      <div
        role="button"
        tabIndex={0}
        ref={reference}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...rest}
        className={classes(
          'flex flex-row items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutralGreen-900 shadow-input placeholder:text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        )}
      >
        {displayedOptions.length === 0 ? (
          <div className="w-full">
            <span className="text-body4 text-neutral-700">{placeholder}</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1">
            {displayedOptions.map((option) => {
              return (
                <div
                  key={String(option.value)}
                  className={classes('flex size-6 items-center justify-center')}
                >
                  {!showOptionIconOnly && option.label}
                  {option.icon && <div>{option.icon}</div>}
                </div>
              );
            })}
            {trimDisplayedOptions &&
              selectedOptions.length > trimDisplayedOptions && (
                <div className="text-body4 text-neutral-900">
                  {`+ ${selectedOptions.length - trimDisplayedOptions} more`}
                </div>
              )}
          </div>
        )}
        <Icon name="ExpandUpDown" size={12} className="" />
      </div>
      {helperText && (
        <span
          className={classes(
            'flex items-center space-x-1 pt-1 text-label7 text-neutral-600 lg:text-label6',
            error && 'text-red-500',
          )}
        >
          {error && <Icon name="AlertCircle" size={12} className="p-0.5" />}
          {helperText}
          {!error && <Icon name="HelpCircle" size={12} className="p-0.5" />}
        </span>
      )}
    </div>
  );
};

_MultiselectInput.displayName = 'MultiselectInput';

export const MultiselectInput = forwardRef(_MultiselectInput);
