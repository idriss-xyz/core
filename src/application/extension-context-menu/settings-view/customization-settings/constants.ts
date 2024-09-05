import { SettingListItem } from './types';

export const transferSettings: SettingListItem[] = [
  {
    label: 'Tipping',
    storageKey: 'idriss-send-enabled',
  },
  {
    label: 'Gitcoin',
    storageKey: 'gitcoin-enabled',
  },
];

export const governanceSettings: SettingListItem[] = [
  {
    label: 'Agora',
    storageKey: 'agora-enabled',
  },
  {
    label: 'Snapshot',
    storageKey: 'snapshot-enabled',
  },
  {
    label: 'Tally',
    storageKey: 'tally-enabled',
  },
];

export const integrationsSettings: SettingListItem[] = [
  {
    label: 'Polymarket',
    storageKey: 'polymarket-enabled',
  },
];
