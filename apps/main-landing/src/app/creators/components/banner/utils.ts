import { IconName } from '@idriss-xyz/ui/icon';

type BannerType =
  | 'unbranded'
  | 'parallel'
  | 'ronin'
  | 'vibes (Pudgy TCG)'
  | 'paragonsDAO'
  | 'avalanche';
export type FilterOption = 'All' | Capitalize<BannerType>;
export const filterOptions: {
  label: FilterOption;
  icon?: IconName;
  customClass?: string;
}[] = [
  { label: 'All' },
  { label: 'Unbranded' },
  { label: 'Parallel', icon: 'ParallelTeam' },
  { label: 'Ronin', icon: 'RoninTeam' },
  { label: 'Vibes (Pudgy TCG)', icon: 'PudgyTeam', customClass: 'h-[16px]' },
  { label: 'ParagonsDAO', icon: 'PdtToken', customClass: 'w-[20px]' },
  { label: 'Avalanche', icon: 'AvaxToken', customClass: 'w-[20px]' },
];
