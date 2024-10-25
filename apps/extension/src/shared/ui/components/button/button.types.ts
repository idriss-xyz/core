import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProperties = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'title' | 'disabled' | 'className'
> & {
  spinnerClassName?: string;
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
};
