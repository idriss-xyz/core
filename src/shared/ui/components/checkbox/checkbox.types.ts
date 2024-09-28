import { ReactNode } from 'react';

export interface CheckboxProperties {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: ReactNode;
  indicator?: ReactNode;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  title?: string;
}
