import {
  ExtensionAddressBookSettingsStorageKeys,
  ExtensionGovernanceSettingsStorageKeys,
  ExtensionIntegrationSettingsStorageKeys,
} from 'shared/extension';

import { SettingListItem } from './types';

export const addressBookSettings: SettingListItem<ExtensionAddressBookSettingsStorageKeys>[] =
  [
    {
      label: 'Tipping',
      storageKey: 'idriss-send-enabled',
    },
    {
      label: 'Block explorers',
      storageKey: 'block-explorers',
    },
  ];

export const governanceSettings: SettingListItem<ExtensionGovernanceSettingsStorageKeys>[] =
  [
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

export const integrationsSettings: SettingListItem<ExtensionIntegrationSettingsStorageKeys>[] =
  [
    {
      label: 'Polymarket',
      storageKey: 'polymarket-enabled',
    },
    {
      label: 'Gitcoin',
      storageKey: 'gitcoin-enabled',
    },
  ];
