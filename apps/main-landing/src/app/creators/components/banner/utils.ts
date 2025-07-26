import { IconName } from '@idriss-xyz/ui/icon';

type BannerType = 'unbranded' | 'parallel' | 'ronin';
export type FilterOption = 'All' | Capitalize<BannerType>;
export const filterOptions: { label: FilterOption; icon?: IconName }[] = [
  { label: 'All' },
  { label: 'Unbranded' },
  { label: 'Parallel', icon: 'ParallelTeam' },
  { label: 'Ronin', icon: 'RoninTeam' },
];
