import { ExtensionSettings } from './types';

export const GET_EXTENSION_SETTINGS_REQUEST = 'GET_EXTENSION_SETTINGS_REQUEST';
export const GET_EXTENSION_SETTINGS_RESPONSE =
  'GET_EXTENSION_SETTINGS_RESPONSE';

export const EXTENSION_POPUP_ROUTE = {
  HOME: '/',
  SETTINGS_HOME: '/settings',
  SETTINGS_CUSTOMIZATION: '/settings/customization',
  TRADING_COPILOT: '/trading-copilot',
} as const;

export type ExtensionPopupRoute =
  (typeof EXTENSION_POPUP_ROUTE)[keyof typeof EXTENSION_POPUP_ROUTE];

export const ROUTE_TITLE: Record<ExtensionPopupRoute, string> = {
  [EXTENSION_POPUP_ROUTE.HOME]: 'Home',
  [EXTENSION_POPUP_ROUTE.SETTINGS_HOME]: 'Settings',
  [EXTENSION_POPUP_ROUTE.SETTINGS_CUSTOMIZATION]: 'Customization',
  [EXTENSION_POPUP_ROUTE.TRADING_COPILOT]: 'Trading Copilot',
};

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
