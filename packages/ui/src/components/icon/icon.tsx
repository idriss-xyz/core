import { IconProperties } from './types';
import { ICON } from './constants';

export const Icon = ({ name, className, ...properties }: IconProperties) => {
  const Icon = ICON[name];
  return <Icon className={className} {...properties} />;
};
