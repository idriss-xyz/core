import { ReactNode } from 'react';

export type Option<T> = {
  prefix?: ReactNode;
  label: string;
  value: T;
  suffix?: ReactNode;
};

export type SelectOptionProperties<T> = {
  option: Option<T>;
  className?: string;
  selected?: boolean;
};

export type SelectProperties<T> = {
  className?: string;
  optionsContainerClassName?: string;
  value: T;
  label?: string;
  renderLabel?: () => ReactNode;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export type SelectOptionContainerProperties = {
  className?: string;
  children?: ReactNode;
};
