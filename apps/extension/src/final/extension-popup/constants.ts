import { POPUP_ROUTE, PopupRoute } from 'shared/extension';

export const POPUP_ROUTE_TITLE: Record<PopupRoute, string> = {
  [POPUP_ROUTE.PRODUCTS]: '',
  [POPUP_ROUTE.SETTINGS]: 'Customization',
  [POPUP_ROUTE.GOVERNANCE_SETTINGS]: 'Governance widget',
  [POPUP_ROUTE.OTHER_SETTINGS]: 'More features',
};

export const SETTINGS_SUBROUTES = [
  POPUP_ROUTE.GOVERNANCE_SETTINGS,
  POPUP_ROUTE.OTHER_SETTINGS,
];
