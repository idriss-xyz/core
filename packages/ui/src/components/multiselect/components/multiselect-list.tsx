import { classes } from '../../../utils';
import { Checkbox } from '../../checkbox';
import { ScrollArea } from '../../scroll-area';
import { MultiselectOption } from '../types';

type Properties<T> = {
  options: MultiselectOption<T>[];
  selectedValues: T[];
  onOptionChange: (optionValue: T) => void;
  className?: string;
};

export const MultiselectInputList = <T,>({
  className,
  options,
  selectedValues,
  onOptionChange,
}: Properties<T>) => {
  return (
    <div
      className={classes(
        'mt-1 flex w-[var(--radix-popper-anchor-width)] flex-col gap-2 overflow-y-auto rounded-xl border border-[#DBDDE2] bg-white p-[8px_0px] shadow-lg',
        className,
      )}
    >
      <ScrollArea
        className="max-h-[184px] transition-all duration-500"
        scrollBarClassName="bg-white hover:bg-white data-[orientation=vertical]:w-2.5"
      >
        {options.length === 0 && (
          <span
            className={classes(
              'flex items-center px-3 py-1 text-label7 text-neutral-600 lg:text-label6',
            )}
          >
            No options available
          </span>
        )}
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <div
              className="px-3 py-1 hover:bg-black/10"
              key={`list-item-${String(option.value)}`}
            >
              <Checkbox
                onChange={() => {
                  return onOptionChange(option.value);
                }}
                className="w-full cursor-pointer"
                value={isSelected}
                label={
                  <div className="flex flex-row items-center gap-3">
                    <span className="truncate text-body4 text-neutral-900">
                      {option.label}
                    </span>
                    {option.icon && <div className="mr-2">{option.icon}</div>}
                  </div>
                }
              />
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};
