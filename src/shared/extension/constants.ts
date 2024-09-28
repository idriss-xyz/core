export const GET_EXTENSION_SETTINGS_REQUEST = 'GET_EXTENSION_SETTINGS_REQUEST';
export const GET_EXTENSION_SETTINGS_RESPONSE =
  'GET_EXTENSION_SETTINGS_RESPONSE';

export const EXTENSION_POPUP_ROUTE = {
  HOME: '/',
  SETTINGS_HOME: '/settings',
  SETTINGS_CUSTOMIZATION: '/settings/customization',
};

export const extensionAddressBookSettingsStorageKeys = [
  'idriss-send-enabled',
  'wallet-lookup-enabled',
] as const;

export const extensionGovernanceSettingsStorageKeys = [
  'snapshot-enabled',
  'tally-enabled',
  'agora-enabled',
] as const;

export const extensionIntegrationSettingsStorageKeys = [
  'polymarket-enabled',
  'gitcoin-enabled',
] as const;

export const extensionSettingsStorageKeys = [
  'entire-extension-enabled',
  ...extensionAddressBookSettingsStorageKeys,
  ...extensionGovernanceSettingsStorageKeys,
  ...extensionIntegrationSettingsStorageKeys,
] as const;

export const SETTINGS_STORAGE_KEY = 'EXTENSION_SETTINGS';
export const EXTENSION_BUTTON_CLICKED = 'EXTENSION_BUTTON_CLICKED';
export const ACTIVE_TAB_CHANGED = 'ACTIVE_TAB_CHANGED';
