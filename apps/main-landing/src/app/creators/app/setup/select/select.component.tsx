import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePortal } from '@idriss-xyz/ui/providers/with-portal';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { AudioVisualizer } from '@/app/creators/components/hero-section/audio-visualizer';
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
  renderRight,
  renderLeft,
  placeholder,
  iconName,
  onIconClick,
  isAudioPlaying,
  optionsContainerClassName,
}: SelectProperties<T> & {
  onIconClick?: () => void;
  isAudioPlaying?: boolean;
}) => {
  const { portal } = usePortal();
  const anchorReference = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!anchorReference.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setWidth(anchorReference.current?.offsetWidth ?? 0);
    });

    resizeObserver.observe(anchorReference.current);
    return () => {
      return resizeObserver.disconnect();
    };
  }, []);

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
          <div
            ref={anchorReference}
            className="flex h-[44px] w-full overflow-hidden rounded-[12px] border border-neutral-200 bg-white text-neutralGreen-900 shadow-input focus:border-neutral-300 focus:outline-none"
          >
            {(renderLeft ?? pickedOption.prefix) && (
              <div className="after:absolute after:inset-y-[2px] after:left-0 after:w-px after:bg-gray-200">
                {renderLeft ? renderLeft() : pickedOption.prefix}
              </div>
            )}

            <div className="flex-1 overflow-hidden px-3">
              <SelectInput
                placeholder={placeholder}
                value={pickedOption.label}
                selected={!!pickedOption}
              />
            </div>
            <div className="flex h-full w-[40px] items-center border-l border-l-gray-200">
              {isAudioPlaying ? (
                <div className="flex size-full items-center justify-center">
                  <AudioVisualizer
                    isMuted={false}
                    disableHover
                    className="!size-4"
                  />
                </div>
              ) : (
                <IconButton
                  className="!h-full !w-full hover:bg-transparent focus:bg-transparent active:bg-transparent"
                  iconName={iconName ?? 'PlayCircle'}
                  size="small"
                  intent="tertiary"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    onIconClick?.();
                  }}
                />
              )}
            </div>
            {renderRight && (
              <div className="flex items-center border-l border-l-gray-200 px-3">
                {renderRight()}
              </div>
            )}
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal container={portal}>
          <DropdownMenu.Content
            sideOffset={2}
            asChild
            style={{ width }}
            align="start"
          >
            <SelectOptionContainer className="py-2">
              <ScrollArea
                className={classes(
                  'max-h-64 gap-1 overflow-y-auto pl-2 pr-4 text-neutral-900',
                  optionsContainerClassName,
                )}
              >
                {options.map((option) => {
                  return (
                    <DropdownMenu.Item
                      key={option.label}
                      className="rounded-[12px] px-3 py-1 outline-none data-[highlighted]:bg-black/10"
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
