import {
  ExtensionAddressBookSettingName,
  ExtensionGovernanceSettingName,
  ExtensionIntegrationSettingName,
  ExtensionSettingsStorageKey,
} from 'shared/extension';

import { SettingListItem, SettingListItemsGroup } from './types';

const addressBookSettings: SettingListItem<ExtensionAddressBookSettingName>[] =
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

const governanceSettings: SettingListItem<ExtensionGovernanceSettingName>[] = [
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

const integrationsSettings: SettingListItem<ExtensionIntegrationSettingName>[] =
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
