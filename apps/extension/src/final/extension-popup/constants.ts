import { POPUP_ROUTE, PopupRoute } from 'shared/extension';

export const POPUP_ROUTE_TITLE: Record<PopupRoute, string> = {
  [POPUP_ROUTE.PRODUCTS]: '',
  [POPUP_ROUTE.SETTINGS]: 'Customization',
  [POPUP_ROUTE.OTHER_SETTINGS]: 'More features',
  [POPUP_ROUTE.TRADING_COPILOT]: 'Trading copilot',
};

export const SETTINGS_SUBROUTES = [POPUP_ROUTE.OTHER_SETTINGS];
