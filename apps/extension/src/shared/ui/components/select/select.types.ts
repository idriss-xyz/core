import { ReactNode } from 'react';

import { PolymorphicComponentProperties } from '../../types';

export interface Option<T> {
  prefix?: ReactNode;
  label: string;
  value: T;
  suffix?: ReactNode;
}

export interface SelectOptionProperties<T> {
  option: Option<T>;
  className?: string;
  selected?: boolean;
}

export interface SelectProperties<T> {
  className?: string;
  optionsContainerClassName?: string;
  value: T;
  label?: string;
  renderLabel?: () => ReactNode;
  options: Option<T>[];
  onChange: (value: T) => void;
}

interface SelectOptionContainerProperties {
  className?: string;
  children?: ReactNode;
}

export type PolymorphicSelectOptionContainerProperties<
  Element extends React.ElementType,
> = PolymorphicComponentProperties<Element, SelectOptionContainerProperties>;

export type SelectOptionContainerComponent = { displayName: string } & (<
  Element extends React.ElementType = 'div',
>(
  properties: PolymorphicSelectOptionContainerProperties<Element>,
) => React.ReactElement | null);
