import { IconName } from '@idriss-xyz/ui/icon';
import { ReactNode } from 'react';

// TODO remove
// ts-unused-exports:disable-next-line
export type Option<T> = {
  value: T;
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  renderLabel?: () => ReactNode;
  onClick?: () => void;
};

export type SelectOptionProperties<T> = {
  option: Option<T>;
  className?: string;
  selected?: boolean;
};

export type SelectInputProperties = {
  className?: string;
  selected?: boolean;
  placeholder?: string;
  iconName?: IconName;
  value: string;
};

export type SelectProperties<T> = {
  value: T;
  label?: string;
  className?: string;
  options: Option<T>[];
  placeholder?: string;
  iconName?: IconName;
  onChange: (value: T) => void;
  renderLabel?: () => ReactNode;
  optionsContainerClassName?: string;
  renderRight?: () => ReactNode;
  renderLeft?: () => ReactNode;
};

export type SelectOptionContainerProperties = {
  className?: string;
  children?: ReactNode;
};
