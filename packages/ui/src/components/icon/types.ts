import { ICON } from './constants';

export type IconName = keyof typeof ICON;
export type IconProperties = {
  name: IconName;
  className?: string;
  size: number;
};
