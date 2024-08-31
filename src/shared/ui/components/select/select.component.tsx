import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMemo } from 'react';

import { usePortal } from '../../providers';
import { classes } from '../../utils';

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
    return options.find((option) => {
      return option.value === value;
    });
  }, [value, options]);

  if (!pickedOption) {
    throw new Error('Option not found');
  }

  return (
    <div className={className}>
      {renderLabel ? (
        renderLabel()
      ) : label ? (
        <p className="mb-1 text-sm text-gray-500">{label}</p>
      ) : null}
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <SelectOptionContainer
            className="ring-1 ring-gray-300 focus:ring-indigo-500"
            as="button"
          >
            <SelectOption option={pickedOption} className="rounded-md" />
          </SelectOptionContainer>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal container={portal}>
          <DropdownMenu.Content sideOffset={2} asChild>
            <SelectOptionContainer
              as="div"
              className={classes(
                'max-h-64 w-[var(--radix-popper-anchor-width)] overflow-y-auto text-black [scrollbar-color:gray_#efefef] [scrollbar-width:thin]',
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
            </SelectOptionContainer>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
