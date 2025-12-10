import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  ReactElement,
  useRef,
} from 'react';

import { classes } from '../../utils';
import { Icon, IconName } from '../icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type BaseProperties = {
  value: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  error?: boolean;
  success?: boolean;
  asTextArea?: boolean;
  placeholder?: string;
  placeholderTooltip?: string;
  disabled?: boolean;
};

type Properties =
  | (BaseProperties & {
      asTextArea: true;
      readOnly: false;
      // allow the same API as the normal input
      suffixElement?: ReactElement;
    })
  | (BaseProperties & {
      asTextArea?: false;
      readOnly?: boolean;
      prefixIconName?: IconName;
      prefixIconSize?: number;
      prefixElement?: ReactElement;
      suffixElement?: ReactElement;
    });

export const Input = forwardRef(
  (
    properties: Properties,
    reference: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const prefixReference = useRef<HTMLDivElement>(null);
    const suffixReference = useRef<HTMLDivElement>(null);

    const {
      value,
      onChange,
      onKeyDown,
      className,
      success,
      error,
      asTextArea,
      readOnly,
      placeholder,
      disabled,
      placeholderTooltip,
    } = properties;
    const inputProperties = {
      className: classes(
        'block min-h-11 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-body5 text-neutralGreen-900 caret-neutralGreen-900 placeholder:text-neutral-600 lg:text-body4',
        success && 'border-mint-400 focus-visible:border-mint-400',
        error && 'border-red-400 focus-visible:border-red-400',
        disabled && 'cursor-not-allowed opacity-50',
        'prefixElement' in properties && 'pl-1',
        className,
      ),
      value,
      onChange,
      placeholder,
      disabled,
      readOnly,
    };

    const inputElement = asTextArea ? (
      <textarea
        ref={reference as ForwardedRef<HTMLTextAreaElement>}
        rows={2}
        {...inputProperties}
        className={classes(
          inputProperties.className,
          'shadow-input',
          'min-h-[4.3125rem] pb-[7px]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        )}
      />
    ) : (
      <label className="block w-full rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500">
        <div className="flex items-center rounded-xl border bg-white shadow-input">
          {properties.prefixIconName && (
            <div ref={prefixReference} className="flex items-center pl-3">
              <Icon
                name={properties.prefixIconName}
                size={properties.prefixIconSize ?? 24}
              />
              <div className="ml-3 h-full border-r border-gray-200" />
            </div>
          )}
          {properties.prefixElement && !properties.prefixIconName && (
            <div
              ref={prefixReference}
              className={classes(
                'flex h-full items-center pl-3 text-body5 text-neutralGreen-900 lg:text-body4',
                !value && 'text-neutral-600',
              )}
            >
              {properties.prefixElement}
            </div>
          )}
          <input
            ref={reference as ForwardedRef<HTMLInputElement>}
            {...inputProperties}
            onKeyDown={onKeyDown}
            className={classes(
              'h-full flex-1 items-center border-none outline-none',
              inputProperties.className,
            )}
          />
          {properties.suffixElement && (
            <div
              ref={suffixReference}
              className="flex items-center self-stretch pr-3"
            >
              {properties.suffixElement}
            </div>
          )}
        </div>
      </label>
    );

    if (placeholderTooltip && placeholder) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{inputElement}</TooltipTrigger>
          <TooltipContent
            className="bg-black text-left text-white"
            side="right"
            sideOffset={-(390 - (placeholder?.length || 0) * 8)}
          >
            <p className="text-label6">{placeholderTooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return inputElement;
  },
);

Input.displayName = 'Input';
