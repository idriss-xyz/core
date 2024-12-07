import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMemo } from 'react';
import { usePortal } from '@idriss-xyz/ui/providers/with-portal';
import { classes } from '@idriss-xyz/ui/utils';

import { ScrollArea } from '../scroll-area';

import { SelectProperties } from './select.types';
import { SelectOption } from './select-option.component';
import { SelectOptionContainer } from './select-option-container.component';

export const Select = <T,>({
  label,
  options,
  value,
  className,
  optionsContainerClassName,
  renderLabel,
  onChange,
}: SelectProperties<T>) => {
  const { portal } = usePortal();
  const pickedOption = useMemo(() => {
    return (
      options.find((option) => {
        return option.value === value;
      }) ?? options[0]
    );
  }, [value, options]);

  if (!pickedOption) {
    throw new Error('Option not found');
  }

  return (
    <div className={className}>
      {renderLabel ? (
        renderLabel()
      ) : label ? (
        <p className="mb-2 text-label5 text-neutral-700 lg:text-label4">
          {label}
        </p>
      ) : null}
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button className="w-full">
            <SelectOptionContainer className="border border-neutral-200 bg-white text-neutralGreen-900 shadow-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <SelectOption option={pickedOption} className="rounded-md" />
            </SelectOptionContainer>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal container={portal}>
          <DropdownMenu.Content sideOffset={2} asChild>
            <SelectOptionContainer>
              <ScrollArea
                className={classes(
                  'max-h-64 w-[var(--radix-popper-anchor-width)] overflow-y-auto text-black',
                  optionsContainerClassName,
                )}
              >
                {options.map((option, index) => {
                  return (
                    <DropdownMenu.Item
                      key={option.label}
                      onSelect={() => {
                        onChange(option.value);
                      }}
                      className="outline-none"
                    >
                      <SelectOption
                        option={option}
                        className={classes(
                          index === 0 && 'rounded-t-md',
                          index === options.length - 1 && 'rounded-b-md',
                        )}
                      />
                    </DropdownMenu.Item>
                  );
                })}
              </ScrollArea>
            </SelectOptionContainer>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
