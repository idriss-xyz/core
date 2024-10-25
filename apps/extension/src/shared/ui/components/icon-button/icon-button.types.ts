import { ButtonHTMLAttributes } from 'react';

import { IconProperties } from '../icon';

export type IconButtonProperties = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  testId?: string;
  iconProps: IconProperties;
};
