import * as RadixForm from '@radix-ui/react-form';
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useState,
  KeyboardEvent,
} from 'react';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { Input } from '../input';

type InputProperties = ComponentProps<typeof Input>;
type InputUnion = InputProperties extends infer T
  ? T extends never
    ? never
    : Omit<T, 'onChange' | 'value'>
  : never;

type Properties = InputUnion & {
  name: string;
  label?: ReactNode;
  helperText?: string;
  value?: string[];
  onChange: (value: string[]) => void;
};

export const TagField = forwardRef(
  (
    {
      name,
      label,
      helperText,
      className,
      value = [],
      onChange,
      ...inputProperties
    }: Properties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ',' || event.key === 'Enter') {
        event.preventDefault();
        const trimmedValue = inputValue.trim();

        if (trimmedValue && !value.includes(trimmedValue)) {
          onChange([...value, trimmedValue]);
        }
        setInputValue('');
      } else if (
        event.key === 'Backspace' &&
        inputValue === '' &&
        value.length > 0
      ) {
        // Remove last tag when backspace is pressed on empty input
        onChange(value.slice(0, -1));
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(
        value.filter((tag) => {
          return tag !== tagToRemove;
        }),
      );
    };

    return (
      <RadixForm.Field name={name} ref={reference} className={className}>
        {label && (
          <RadixForm.Label className="mb-2 block text-label4 text-neutralGreen-700">
            {label}
          </RadixForm.Label>
        )}

        <div className="space-y-2">
          {/* Input Field */}
          <RadixForm.Control asChild>
            <Input
              {...inputProperties}
              value={inputValue}
              onChange={(event) => {
                return setInputValue(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type and press comma or enter to add words"
            />
          </RadixForm.Control>

          {/* Tags Display */}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {value.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="group flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm transition-colors"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        return removeTag(tag);
                      }}
                      aria-label={`Remove ${tag}`}
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {helperText && (
          <span
            className={classes(
              'flex items-center space-x-1 pt-1 text-label7 text-neutral-600 lg:text-label7',
              inputProperties.error && 'text-red-500',
            )}
          >
            {inputProperties.error && (
              <Icon name="AlertCircle" size={12} className="p-0.5" />
            )}
            {helperText}
            {!inputProperties.error && (
              <Icon name="HelpCircle" size={12} className="p-0.5" />
            )}
          </span>
        )}
      </RadixForm.Field>
    );
  },
);

TagField.displayName = 'TagField';
