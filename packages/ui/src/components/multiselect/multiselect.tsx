import { ReactNode, useMemo } from 'react';

import { Dropdown } from '../dropdown';
import { classes } from '../../utils';

import { MultiselectOption } from './types';
import { MultiselectInputList, MultiselectInput } from './components';

type Properties<T> = {
  options: MultiselectOption<T>[];
  value: T[];
  onChange: (selectedValues: T[]) => void;
  placeholder?: string;
  maxCount?: number;
  inputClassName?: string;
  listClassName?: string;
  label?: string;
  renderLabel?: () => ReactNode;
  helperText?: string;
  error?: boolean;
};

export const Multiselect = <T,>({
  options,
  value,
  onChange: onChange,
  placeholder = 'Select options',
  maxCount = 10,
  inputClassName,
  listClassName,
  label,
  renderLabel,
  helperText,
  error,
}: Properties<T>) => {
  const selectedOptions = useMemo(() => {
    return options.filter((option) => {
      return value.includes(option.value);
    });
  }, [value, options]);

  const toggleOption = (optionValue: T) => {
    const newSelectedValues = value.includes(optionValue)
      ? value.filter((value_) => {
          return value_ !== optionValue;
        })
      : [...value, optionValue];
    onChange(newSelectedValues);
  };

  return (
    <Dropdown
      className={classes('z-portal')}
      trigger={() => {
        return (
          <MultiselectInput
            label={label}
            renderLabel={renderLabel}
            selectedOptions={selectedOptions}
            placeholder={placeholder}
            showOptionIconOnly
            trimDisplayedOptions={maxCount}
            className={inputClassName}
            helperText={helperText}
            error={error}
          />
        );
      }}
      // eslint-disable-next-line react/no-children-prop
      children={(properties) => {
        return (
          <MultiselectInputList
            onOptionChange={toggleOption}
            options={options}
            selectedValues={value}
            className={listClassName}
            {...properties}
          />
        );
      }}
    />
  );
};
