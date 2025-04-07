import { useCallback, useEffect, useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { classes, PortalWithTailwind, usePooling } from 'shared/ui';
import { useEventsLogger } from 'shared/observability';
import { createLookup } from 'shared/utils';
import { GetYapsCommand } from 'application/kaito';
import { KAITO_LOGO } from 'assets/images';

import { TradingCopilotTooltip } from '../notifications-popup/components/trading-copilot-tooltip';
import { useLocationInfo } from '../hooks';

const EVENT = createLookup(['YAPS_STATS_HOVER']);

export const YapsStats = () => {
  const { isTwitter } = useLocationInfo();

  const isOrganization = !!usePooling({
    callback: () => {
      const expectedPath =
        'M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z';

      const path = document.querySelector(
        `[data-testid="UserName"] [data-testid="icon-verified"] path[d="${expectedPath}"]`,
      );

      return path;
    },
    defaultValue: null,
    interval: 1000,
  });

  const containersForInjection = usePooling<Element[] | null>({
    callback: () => {
      return [
        ...document.querySelectorAll(`[data-testid^='UserAvatar-Container-']`),
      ];
    },
    interval: 1000,
    enabled: isTwitter,
    defaultValue: null,
  });

  let lookingForFirstNonHoverCardElement = true;

  return (
    <>
      {containersForInjection?.map((containerForInjection, index) => {
        const isAccountSwitcherElement =
          containerForInjection?.parentElement?.parentElement?.getAttribute(
            'data-testid',
          ) === 'SideNav_AccountSwitcher_Button';

        const isTweetElement =
          containerForInjection?.parentElement?.parentElement?.parentElement?.getAttribute(
            'data-testid',
          ) === 'Tweet-User-Avatar';

        if (isAccountSwitcherElement) {
          return;
        }

        const isPopupElement =
          containerForInjection?.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
            'data-testid',
          ) === 'HoverCard';

        const isMainElement =
          !isPopupElement &&
          !isTweetElement &&
          lookingForFirstNonHoverCardElement;

        lookingForFirstNonHoverCardElement = isPopupElement;

        return (
          <YapsStatsElement
            isMainElement={isMainElement}
            isPopupElement={isPopupElement}
            isOrganization={isOrganization}
            key={`containersForInjection${index}`}
            containerForInjection={containerForInjection}
          />
        );
      })}
    </>
  );
};

type ElementProperties = {
  isMainElement: boolean;
  isOrganization: boolean;
  isPopupElement: boolean;
  containerForInjection: Element;
};

const YapsStatsElement = ({
  isMainElement,
  isOrganization,
  isPopupElement,
  containerForInjection,
}: ElementProperties) => {
  const { isTwitter } = useLocationInfo();
  const eventsLogger = useEventsLogger();
  const enableFunctionalities = isMainElement || isPopupElement;
  const [portal, setPortal] = useState<HTMLDivElement>();
  const [isHovered, setIsHovered] = useState(false);

  const testId = (containerForInjection as HTMLElement).dataset.testid;
  const username = testId?.replace('UserAvatar-Container-', '');

  const enabled = isTwitter && Boolean(username) && isHovered;

  const yapsQuery = useCommandQuery({
    command: new GetYapsCommand({ username: username ?? '' }),
    enabled,
  });

  useEffect(() => {
    const cleanup = () => {
      newPortal?.remove();
      container?.remove();
      setPortal(undefined);
    };

    if (!containerForInjection) {
      return;
    }

    if (enableFunctionalities && containerForInjection instanceof HTMLElement) {
      containerForInjection.style.marginBottom = isMainElement ? '24px' : '8px';
    }

    if (containerForInjection.parentElement instanceof HTMLElement) {
      containerForInjection.parentElement.style.zIndex = '1';
    }

    const container = document.createElement('div');

    containerForInjection?.append(container);
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const newPortal = document.createElement('div');
    newPortal.classList.add('top-0', 'right-0', 'absolute', 'size-full');
    shadowRoot.append(newPortal);
    setPortal(newPortal);

    return cleanup;
  }, [containerForInjection, enableFunctionalities, isMainElement]);

  const onHover = useCallback(() => {
    setIsHovered(true);

    void eventsLogger.track(EVENT.YAPS_STATS_HOVER);
  }, [eventsLogger, setIsHovered]);

  if (!portal || !containerForInjection || isOrganization) {
    return null;
  }

  return (
    <PortalWithTailwind container={portal}>
      <TradingCopilotTooltip
        onMouseEnter={onHover}
        triggerClassName="block size-full"
        wrapperClassName="block size-full"
        disableTooltip={!enableFunctionalities}
        className={classes(
          'top-full translate-y-4 select-none bg-black px-3 py-2',
          isPopupElement && 'left-0 translate-x-0',
        )}
        content={
          <div className="flex flex-col gap-1">
            {yapsQuery.isLoading ? (
              <span>Loading...</span>
            ) : yapsQuery.data?.yaps_all ? (
              <>
                <span>Total Yaps: {Math.round(yapsQuery.data.yaps_all)}</span>
                <span>Smart followers: {Math.round(Math.random() * 100)}</span>
              </>
            ) : (
              <span>No data available</span>
            )}
          </div>
        }
      >
        {enableFunctionalities && (
          <img
            alt=""
            src={KAITO_LOGO}
            className={classes(
              'absolute -bottom-4 left-1/2 z-1 size-8 -translate-x-1/2',
              isPopupElement && '-bottom-3 size-6',
            )}
          />
        )}
        <span className="absolute right-0 top-0 size-full rounded-full border-2 border-[#32ffdc]" />
      </TradingCopilotTooltip>
    </PortalWithTailwind>
  );
};
