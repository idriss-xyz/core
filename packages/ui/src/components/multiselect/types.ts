import { ReactElement } from 'react';

export type MultiselectOption<T> = {
  label: string;
  value: T;
  icon?: ReactElement;
};
