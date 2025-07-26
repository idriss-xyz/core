import { IconProperties } from './types';
import { ICON } from './constants';

export const Icon = ({
  name,
  className,
  size = 24,
  ...properties
}: IconProperties) => {
  const Icon = ICON[name];
  return <Icon size={size} className={className} {...properties} />;
};
