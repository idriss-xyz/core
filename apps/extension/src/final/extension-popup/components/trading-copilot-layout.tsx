import { Outlet } from 'react-router';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useMemo } from 'react';

import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import { POPUP_ROUTE_TITLE } from '../constants';

const IconPlaceholder = () => {
  return <div className="size-11" />;
};

export const TradingCopilotLayout = () => {
  const popup = useExtensionPopup();
  const title = POPUP_ROUTE_TITLE[popup.currentRoute];

  const leftColumn = useMemo(() => {
    const allowToNavigateBack =
      popup.currentRoute === POPUP_ROUTE.TRADING_COPILOT;
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

  return (
    <div className="h-full bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        {leftColumn}

        <h1 className="text-heading4 text-neutral-900">{title}</h1>

        <IconPlaceholder />
      </div>
      <Outlet />
    </div>
  );
};
