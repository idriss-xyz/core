import { ReactNode } from 'react';

export type Option<T> = {
  value: T;
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export type SelectOptionProperties<T> = {
  option: Option<T>;
  className?: string;
  selected?: boolean;
  disableHover?: boolean;
  /** Hides the grey “suffix bubble” when the option is used in a trigger. */
  hideSuffix?: boolean;
};

export type SelectProperties<T> = {
  value: T;
  label?: string;
  className?: string;
  options: Option<T>[];
  onChange: (value: T) => void;
  renderLabel?: () => ReactNode;
  optionsContainerClassName?: string;
  renderRight?: () => ReactNode;
};

export type SelectOptionContainerProperties = {
  className?: string;
  children?: ReactNode;
};
