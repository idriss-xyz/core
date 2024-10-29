import { IconProperties } from './types';
import { ICON } from './constants';

export const Icon = ({ name, ...properties }: IconProperties) => {
  const Icon = ICON[name];
  return <Icon {...properties} />;
};
