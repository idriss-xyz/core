import { Button } from 'shared/ui/components';
import { classes } from 'shared/ui/utils';

import { OUTCOME } from '../../polymarket.constants';

import { VoteButtonProperties } from './vote-button.types';

export const VoteButton = ({
  onClick,
  className,
  children,
  isActive,
  outcome,
  disabled = false,
}: VoteButtonProperties) => {
  return (
    <Button
      className={classes(
        'rounded-lg bg-[#2C3F4F] py-4 font-semibold text-[##858D92]',
        isActive && 'text-white',
        // TODO: cva for variant styles
        isActive && outcome === OUTCOME.YES && 'bg-[#27AE60]',
        isActive && outcome === OUTCOME.NO && 'bg-[#E64800]',

        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
