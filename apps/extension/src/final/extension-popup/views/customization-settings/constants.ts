import {
  ExtensionAddressBookSettingName,
  ExtensionGovernanceSettingName,
  ExtensionIntegrationSettingName,
  ExtensionTradingCopilotSettingName,
} from 'shared/extension';

import { SettingListItem } from './types';

export const tradingCopilotSettings: SettingListItem<ExtensionTradingCopilotSettingName>[] =
  [
    {
      label: 'Latest transactions',
      storageKey: 'trading-copilot-latest-transactions-enabled',
    },
    {
      label: 'Notifications',
      storageKey: 'trading-copilot-notifications-enabled',
    },
  ];

export const addressBookSettings: SettingListItem<ExtensionAddressBookSettingName>[] =
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

export const governanceSettings: SettingListItem<ExtensionGovernanceSettingName>[] =
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

export const integrationsSettings: SettingListItem<ExtensionIntegrationSettingName>[] =
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
