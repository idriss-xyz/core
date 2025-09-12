import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMemo } from 'react';
import { usePortal } from '@idriss-xyz/ui/providers/with-portal';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

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
  optionsContainerClassName,
  renderRight,
  renderLeft,
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
          <button className="block w-full">
            <SelectOptionContainer className="flex overflow-hidden border border-neutral-200 bg-white text-neutralGreen-900 shadow-input focus-visible:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              {renderLeft && (
                <div className="relative flex items-center px-3 before:absolute before:inset-y-[2px] before:right-0 before:w-px before:bg-neutral-200">
                  {renderLeft()}
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <SelectOption
                  option={pickedOption}
                  selected
                  disableHover
                  hideSuffix
                  hidePrefix
                />
              </div>

              {renderRight && (
                <div className="relative flex items-center px-3 before:absolute before:inset-y-[2px] before:left-0 before:w-px before:bg-neutral-200">
                  {renderRight()}
                </div>
              )}
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
                      className="outline-none"
                      onSelect={() => {
                        onChange(option.value);
                      }}
                    >
                      <SelectOption
                        option={option}
                        className={classes(
                          'border border-neutral-300',
                          index !== options.length - 1 && 'border-b-0',
                          index !== 0 && 'border-t-0',
                          index === 0 && 'rounded-t-[12px]',
                          index === options.length - 1 && 'rounded-b-[12px]',
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
