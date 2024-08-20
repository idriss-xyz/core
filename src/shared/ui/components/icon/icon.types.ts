import * as Icons from '@radix-ui/react-icons';

export type IconName = keyof typeof Icons;

export interface IconProperties {
  name: IconName;
  className?: string;
  size?: number;
}
