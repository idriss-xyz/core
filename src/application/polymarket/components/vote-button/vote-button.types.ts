import { ButtonProperties } from 'shared/ui/components';

import { Outcome } from '../../polymarket.types';

export interface VoteButtonProperties extends ButtonProperties {
  isActive: boolean;
  outcome: Outcome;
}
