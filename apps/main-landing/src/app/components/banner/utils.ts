import { IconName } from '@idriss-xyz/ui/icon';

type BannerType =
  | 'unbranded'
  | 'parallel'
  | 'avalanche'
  | 'Off The Grid'
  | 'ronin'
  | 'vibes (Pudgy TCG)'
  | 'paragonsDAO';

export type FilterOption = 'All' | Capitalize<BannerType>;
export const filterOptions: {
  label: FilterOption;
  icon?: IconName;
  customClass?: string;
}[] = [
  { label: 'All' },
  { label: 'Unbranded' },
  { label: 'Parallel', icon: 'ParallelTeam' },
  { label: 'Avalanche', icon: 'AvaxToken', customClass: 'w-[20px]' },
  { label: 'Off The Grid', icon: 'GunToken', customClass: 'w-[20px]' },
  { label: 'Ronin', icon: 'RoninTeam' },
  { label: 'Vibes (Pudgy TCG)', icon: 'PudgyTeam', customClass: 'h-[16px]' },
  { label: 'ParagonsDAO', icon: 'PdtToken', customClass: 'w-[20px]' },
];
