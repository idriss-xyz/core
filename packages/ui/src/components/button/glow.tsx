import { classes } from '../../utils';

import { glow, GlowVariants } from './variants';

type Properties = GlowVariants;

export const Glow = ({ intent }: Properties) => {
  return <div className={classes(glow({ intent }))} />;
};
