import { VariantProps } from 'class-variance-authority';

import { classes } from '../../utils';

import { glow, GlowVariants } from './variants';

type Properties = GlowVariants & {
  colorScheme?: VariantProps<typeof glow>['colorScheme'];
};

export const Glow = ({ intent, size, loading, colorScheme }: Properties) => {
  return (
    <div
      className={classes(
        glow({
          intent,
          size,
          loading,
          ...(colorScheme ? { colorScheme } : {}),
        }),
      )}
    />
  );
};
