import { Outlet } from 'react-router';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useMemo } from 'react';

import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import { POPUP_ROUTE_TITLE, SETTINGS_SUBROUTES } from '../constants';

const IconPlaceholder = () => {
  return <div className="size-11" />;
};

export const SettingsLayout = () => {
  const popup = useExtensionPopup();
  const title = POPUP_ROUTE_TITLE[popup.currentRoute];

  const leftColumn = useMemo(() => {
    const allowToNavigateBack = SETTINGS_SUBROUTES.includes(popup.currentRoute);
    return allowToNavigateBack ? (
      <IconButton
        intent="tertiary"
        size="medium"
        iconName="ArrowLeft"
        onClick={popup.navigateBack}
      />
    ) : (
      <IconPlaceholder />
    );
  }, [popup.currentRoute, popup.navigateBack]);

  const rightColumn = useMemo(() => {
    const allowToExitSettings = popup.currentRoute === POPUP_ROUTE.SETTINGS;
    const exitSettings = () => {
      return popup.navigate(POPUP_ROUTE.PRODUCTS);
    };
    return allowToExitSettings ? (
      <IconButton
        intent="tertiary"
        size="medium"
        iconName="X"
        onClick={exitSettings}
      />
    ) : (
      <IconPlaceholder />
    );
  }, [popup]);

  return (
    <div className="h-full bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        {leftColumn}

        <h1 className="text-heading4 text-neutral-900">{title}</h1>

        {rightColumn}
      </div>
      <Outlet />
    </div>
  );
};
