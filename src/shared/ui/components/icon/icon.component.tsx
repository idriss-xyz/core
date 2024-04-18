import { useMemo } from 'react';
// TODO: consider lazy loading
import * as Icons from '@radix-ui/react-icons';

import { IconProperties } from './icon.types';
import { classes } from 'shared/ui/utils';

export const Icon = ({ name, className, size = 24 }: IconProperties) => {
  const IconComponent = useMemo(() => {
    // eslint-disable-next-line import/namespace
    return Icons[name];
  }, [name]);

  return <IconComponent height={size} width={size} className={classes('inline-block', className)} />;
};
