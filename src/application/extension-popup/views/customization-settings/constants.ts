import {
  ExtensionAddressBookSettingsStorageKeys,
  ExtensionGovernanceSettingsStorageKeys,
  ExtensionIntegrationSettingsStorageKeys,
  ExtensionSettingsStorageKey,
} from 'shared/extension';

import { SettingListItem, SettingListItemsGroup } from './types';

const addressBookSettings: SettingListItem<ExtensionAddressBookSettingsStorageKeys>[] =
  [
    {
      label: 'Tipping',
      storageKey: 'idriss-send-enabled',
    },
    {
      label: 'Block explorers',
      storageKey: 'wallet-lookup-enabled',
    },
  ];

const governanceSettings: SettingListItem<ExtensionGovernanceSettingsStorageKeys>[] =
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

const integrationsSettings: SettingListItem<ExtensionIntegrationSettingsStorageKeys>[] =
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

export const settingListItemGroups: SettingListItemsGroup<ExtensionSettingsStorageKey>[] =
  [
    { label: 'Address Book', settingListItems: addressBookSettings },
    { label: 'Governance', settingListItems: governanceSettings },
    { label: 'Integrations', settingListItems: integrationsSettings },
  ];
