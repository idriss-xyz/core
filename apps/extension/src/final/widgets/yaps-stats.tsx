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
  const { isTwitter, isUserPage, username } = useLocationInfo();
  const [isHovered, setIsHovered] = useState(false);

  const enabled = isTwitter && isUserPage && Boolean(username) && isHovered;

  const yapsQuery = useCommandQuery({
    command: new GetYapsCommand({ username: username ?? '' }),
    enabled,
  });

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
        ...document.querySelectorAll(
          `[data-testid='UserAvatar-Container-${username}']`,
        ),
      ];
    },
    interval: 1000,
    defaultValue: null,
    enabled: isTwitter && isUserPage && Boolean(username),
  });

  const updateIsHovered = (value: boolean) => {
    setIsHovered(value);
  };

  let lookingForFirstNonHoverCardElement = true;

  return (
    <>
      {containersForInjection?.map((containerForInjection, index) => {
        const isPopupElement =
          containerForInjection?.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
            'data-testid',
          ) === 'HoverCard';
        const isMainElement =
          !isPopupElement && lookingForFirstNonHoverCardElement;

        lookingForFirstNonHoverCardElement = isPopupElement;

        return (
          <YapsStatsElement
            isMainElement={isMainElement}
            isPopupElement={isPopupElement}
            isOrganization={isOrganization}
            updateIsHovered={updateIsHovered}
            yapsLoading={yapsQuery.isLoading}
            yapsAmount={yapsQuery.data?.yaps_all}
            key={`containersForInjection${index}`}
            containerForInjection={containerForInjection}
          />
        );
      })}
    </>
  );
};

type ElementProperties = {
  yapsAmount?: number;
  yapsLoading: boolean;
  isMainElement: boolean;
  isOrganization: boolean;
  isPopupElement: boolean;
  containerForInjection: Element;
  updateIsHovered: (value: boolean) => void;
};

const YapsStatsElement = ({
  yapsAmount,
  yapsLoading,
  isMainElement,
  isOrganization,
  isPopupElement,
  updateIsHovered,
  containerForInjection,
}: ElementProperties) => {
  const eventsLogger = useEventsLogger();
  const enableFunctionalities = isMainElement || isPopupElement;
  const [portal, setPortal] = useState<HTMLDivElement>();

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
      containerForInjection.style.marginBottom = isMainElement
        ? '24px'
        : '12px';
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
    updateIsHovered(true);

    void eventsLogger.track(EVENT.YAPS_STATS_HOVER);
  }, [eventsLogger, updateIsHovered]);

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
            {yapsLoading ? (
              <span>Loading...</span>
            ) : yapsAmount ? (
              <>
                <span>Total Yaps: {Math.round(yapsAmount)}</span>
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
            className="absolute -bottom-4 left-1/2 z-1 size-8 -translate-x-1/2"
          />
        )}
        <span className="absolute right-0 top-0 size-full rounded-full border-2 border-[#32ffdc]" />
      </TradingCopilotTooltip>
    </PortalWithTailwind>
  );
};
