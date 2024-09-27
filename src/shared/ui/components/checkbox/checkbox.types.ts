import { ReactNode } from 'react';

export interface CheckboxProperties {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  indicator?: ReactNode;
  disabled?: boolean;
  className?: string;
  title?: string;
}
