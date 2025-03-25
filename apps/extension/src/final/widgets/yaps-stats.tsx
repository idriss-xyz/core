import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-use';

import { useCommandQuery } from 'shared/messaging';
import { classes, PortalWithTailwind, usePooling } from 'shared/ui';
import { useEventsLogger } from 'shared/observability';
import { createLookup } from 'shared/utils';
import { GetYapsCommand } from 'application/kaito';

import { TradingCopilotTooltip } from '../notifications-popup/components/trading-copilot-tooltip';
import { useLocationInfo } from '../hooks';

const EVENT = createLookup(['YAPS_STATS_HOVER']);

export const YapsStats = () => {
  const { isTwitter, isUserPage, username } = useLocationInfo();
  const location = useLocation();
  const [portal, setPortal] = useState<HTMLDivElement>();
  const [isHovered, setIsHovered] = useState(false);
  const eventsLogger = useEventsLogger();

  const enabled = isTwitter && isUserPage && Boolean(username) && isHovered;

  const yapsQuery = useCommandQuery({
    command: new GetYapsCommand({ username: username ?? '' }),
    enabled,
  });

  const childOfContainerForInjection = usePooling<Element | null>({
    callback: () => {
      return (
        document.querySelector('[data-testid="userActions"]') ??
        document.querySelector('[data-testid="editProfileButton"]')
      );
    },
    defaultValue: null,
    enabled: isTwitter && isUserPage && Boolean(username),
    interval: 1000,
  });

  useEffect(() => {
    const cleanup = () => {
      newPortal?.remove();
      container?.remove();
      setPortal(undefined);
    };

    const buttonsContainer = childOfContainerForInjection?.parentElement;
    const followButton = buttonsContainer?.lastElementChild;
    if (!followButton) {
      return cleanup;
    }
    const container = document.createElement('div');
    buttonsContainer?.insertBefore(container, followButton);
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const newPortal = document.createElement('div');
    shadowRoot.append(newPortal);
    setPortal(newPortal);

    return cleanup;
  }, [location.pathname, childOfContainerForInjection?.parentElement]);

  const onHover = useCallback(() => {
    setIsHovered(true);
    void eventsLogger.track(EVENT.YAPS_STATS_HOVER);
  }, [eventsLogger]);

  if (!portal || !childOfContainerForInjection) {
    return null;
  }

  const otherButtonsHeight = childOfContainerForInjection.getBoundingClientRect().height;
  const isSmallVariant = otherButtonsHeight <= 32;
  const iconHeight = isSmallVariant ? 20 : 24;

  return (
    <PortalWithTailwind container={portal}>
      <TradingCopilotTooltip
        className="-translate-y-6"
        content={
          <div className="flex flex-col gap-1">
            {yapsQuery.isLoading ? (
              <div>Loading...</div>
            ) : yapsQuery.data ? (
              <>
                <div>Total Yaps: {yapsQuery.data.yaps_all.toLocaleString()}</div>
                <div>24h Change: {yapsQuery.data.yaps_l24h > 0 ? '+' : ''}{yapsQuery.data.yaps_l24h.toLocaleString()}</div>
              </>
            ) : (
              <div>No data available</div>
            )}
          </div>
        }
      >
        <button
          className={classes(
            'mb-3 mr-2 flex cursor-pointer items-center justify-center rounded-full bg-[#794BC4] p-1.5',
            'hover:bg-[#8959d4]'
          )}
          onMouseEnter={onHover}
        >
          <span 
            style={{height: iconHeight, width: iconHeight}}
            className="text-white font-bold"
          >
            Y
          </span>
        </button>
      </TradingCopilotTooltip>
    </PortalWithTailwind>
  );
};
