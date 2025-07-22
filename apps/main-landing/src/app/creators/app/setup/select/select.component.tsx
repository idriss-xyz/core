import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMemo } from 'react';
import { usePortal } from '@idriss-xyz/ui/providers/with-portal';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { SelectInput } from '@/app/creators/app/setup/select/select-input';

import { SelectProperties } from './select.types';
import { SelectOption } from './select-option.component';
import { SelectOptionContainer } from './select-option-container.component';

export const Select = <T,>({
  label,
  value,
  options,
  onChange,
  className,
  renderLabel,
  placeholder,
  iconName,
  optionsContainerClassName,
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
        <p className="mb-2 text-label4 text-neutralGreen-700">{label}</p>
      ) : null}

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button className="flex h-[44px] w-full">
            <SelectOptionContainer className="overflow-hidden border border-neutral-200 bg-white text-neutralGreen-900 shadow-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <SelectInput
                placeholder={placeholder}
                value={pickedOption.label}
                selected={!!pickedOption}
                iconName={iconName}
              />
            </SelectOptionContainer>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal container={portal}>
          <DropdownMenu.Content sideOffset={2} asChild>
            <SelectOptionContainer className="py-2">
              <ScrollArea
                className={classes(
                  'max-h-64 w-[var(--radix-popper-anchor-width)] gap-1 overflow-y-auto pl-2 pr-4 text-black',
                  optionsContainerClassName,
                )}
              >
                {options.map((option) => {
                  return (
                    <DropdownMenu.Item
                      key={option.label}
                      className="rounded-lg px-3 py-1 outline-none hover:bg-black/10 focus:bg-black/50 data-[highlighted]:bg-black/10"
                      onSelect={() => {
                        onChange(option.value);
                      }}
                    >
                      <SelectOption option={option} />
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
