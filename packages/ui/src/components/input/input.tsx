import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  ReactElement,
  useRef,
} from 'react';

import { classes } from '../../utils';
import { Icon, IconName } from '../icon';

type BaseProperties = {
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  className?: string;
  error?: boolean;
  success?: boolean;
};

type Properties =
  | (BaseProperties & {
      asTextArea: true;
    })
  | (BaseProperties & {
      asTextArea?: false;
      prefixIconName?: IconName;
      suffixElement?: ReactElement;
    });

export const Input = forwardRef(
  (
    properties: Properties,
    reference: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const prefixRef = useRef<HTMLDivElement>(null);
    const suffixRef = useRef<HTMLDivElement>(null);

    const { value, onChange, className, success, error, asTextArea } =
      properties;
    const inputProperties = {
      className: classes(
        'min-h-11 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-body5 text-neutralGreen-900 caret-neutralGreen-900 shadow-input placeholder:text-neutral-600 lg:text-body4',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        success && 'border-mint-400 focus-visible:border-mint-400',
        error && 'border-red-400 focus-visible:border-red-400',
        className,
      ),
      value,
      onChange,
    };

    if (asTextArea) {
      return (
        <textarea
          ref={reference as ForwardedRef<HTMLTextAreaElement>}
          rows={2}
          {...inputProperties}
        />
      );
    }
    return (
      <label>
        <div className="relative">
          {properties.prefixIconName && (
            <div
              ref={prefixRef}
              className={
                'absolute left-0 top-0 flex h-full items-center py-[2px] pl-3'
              }
            >
              <Icon name={properties.prefixIconName} size={24} />
              <div className="ml-3 h-full border-r-[1px] border-gray-200" />
            </div>
          )}
          <input
            ref={reference as ForwardedRef<HTMLInputElement>}
            {...inputProperties}
            style={{
              paddingLeft:
                properties.prefixIconName &&
                `${(prefixRef.current?.offsetWidth ?? 0) + 12}px`,
              paddingRight:
                properties.suffixElement &&
                `${(suffixRef.current?.offsetWidth ?? 0) + 12}px`,
            }}
          />
          {properties.suffixElement && (
            <div
              ref={suffixRef}
              className="absolute right-0 top-0 flex h-full items-center pr-3"
            >
              {properties.suffixElement}
            </div>
          )}
        </div>
      </label>
    );
  },
);

Input.displayName = 'Input';
