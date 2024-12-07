import { classes } from '../../utils';

import { glow, GlowVariants } from './variants';

type Properties = GlowVariants;

export const Glow = ({ intent, size, loading }: Properties) => {
  return <div className={classes(glow({ intent, size, loading }))} />;
};
