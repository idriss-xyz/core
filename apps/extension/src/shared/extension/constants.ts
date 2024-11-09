import { ExtensionSettings } from './types';

export const GET_EXTENSION_SETTINGS_REQUEST = 'GET_EXTENSION_SETTINGS_REQUEST';
export const GET_EXTENSION_SETTINGS_RESPONSE =
  'GET_EXTENSION_SETTINGS_RESPONSE';

export const POPUP_ROUTE = {
  PRODUCTS: '/products',
  SETTINGS: '/settings',
  GOVERNANCE_SETTINGS: '/settings/governance',
  OTHER_SETTINGS: '/settings/other',
} as const;

export type PopupRoute = (typeof POPUP_ROUTE)[keyof typeof POPUP_ROUTE];

export const SETTINGS_STORAGE_KEY = 'EXTENSION_SETTINGS';
export const EXTENSION_BUTTON_CLICKED = 'EXTENSION_BUTTON_CLICKED';
export const ACTIVE_TAB_CHANGED = 'ACTIVE_TAB_CHANGED';

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  'agora-enabled': true,
  'tally-enabled': true,
  'gitcoin-enabled': true,
  'snapshot-enabled': true,
  'polymarket-enabled': true,
  'idriss-send-enabled': true,
  'wallet-lookup-enabled': true,
  'entire-extension-enabled': true,
  'trading-copilot-notifications-enabled': true,
  'trading-copilot-latest-transactions-enabled': true,
};
