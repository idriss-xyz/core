import { useCallback, useEffect, useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { classes, PortalWithTailwind, usePooling } from 'shared/ui';
import { useEventsLogger } from 'shared/observability';
import { createLookup } from 'shared/utils';
import {
  GetYapsCommand,
  GetSmartFollowersCommand,
  checkForOrganizationBadge,
} from 'application/kaito';
import { KAITO_LOGO } from 'assets/images';

import { TradingCopilotTooltip } from '../notifications-popup/components/trading-copilot-tooltip';
import { useLocationInfo } from '../hooks';

const EVENT = createLookup(['YAPS_STATS_HOVER']);

export const YapsStats = () => {
  const { isTwitter } = useLocationInfo();

  const profileContainersForInjection = usePooling<Element[] | null>({
    callback: () => {
      const placesToDisplay = [
        ...document.querySelectorAll(`[data-testid="UserName"]`),
      ]
        .map((selector) => {
          return selector.parentElement;
        })
        .filter(Boolean);

      return placesToDisplay.flatMap((place) => {
        return [
          ...place.querySelectorAll(`[data-testid^='UserAvatar-Container-']`),
        ];
      });
    },
    interval: 1000,
    enabled: isTwitter,
    defaultValue: null,
  });

  const tweetContainersForInjection = usePooling<Element[] | null>({
    callback: () => {
      const placesToDisplay = [
        ...document.querySelectorAll(`[data-testid="tweet"]`),
      ];

      return placesToDisplay.flatMap((place) => {
        return [
          ...place.querySelectorAll(`[data-testid^='UserAvatar-Container-']`),
        ];
      });
    },
    interval: 1000,
    enabled: isTwitter,
    defaultValue: null,
  });

  const hoverCardContainersForInjection = usePooling<Element[] | null>({
    callback: () => {
      const placesToDisplay = [
        ...document.querySelectorAll(`[data-testid="HoverCard"]`),
      ];

      return placesToDisplay.flatMap((place) => {
        return [
          ...place.querySelectorAll(`[data-testid^='UserAvatar-Container-']`),
        ];
      });
    },
    interval: 1000,
    enabled: isTwitter,
    defaultValue: null,
  });

  const isProfilePage = !!usePooling({
    callback: () => {
      const path = document.querySelector(
        `[data-testid="UserProfileHeader_Items"]`,
      );

      return path;
    },
    defaultValue: null,
    interval: 1000,
  });

  return (
    <>
      {profileContainersForInjection?.map((containerForInjection, index) => {
        return (
          <YapsStatsElement
            isMainElement
            isProfilePage={isProfilePage}
            key={`profileContainersForInjection${index}`}
            containerForInjection={containerForInjection}
          />
        );
      })}

      {tweetContainersForInjection?.map((containerForInjection, index) => {
        return (
          <YapsStatsElement
            isTweetElement
            isProfilePage={isProfilePage}
            key={`tweetContainersForInjection${index}`}
            containerForInjection={containerForInjection}
          />
        );
      })}

      {hoverCardContainersForInjection?.map((containerForInjection, index) => {
        return (
          <YapsStatsElement
            isPopupElement
            isProfilePage={isProfilePage}
            containerForInjection={containerForInjection}
            key={`hoverCardContainersForInjection${index}`}
          />
        );
      })}
    </>
  );
};

type ElementProperties = {
  isProfilePage: boolean;
  isMainElement?: boolean;
  isPopupElement?: boolean;
  isTweetElement?: boolean;
  containerForInjection: Element;
};

const YapsStatsElement = ({
  isMainElement,
  isProfilePage,
  isPopupElement,
  isTweetElement,
  containerForInjection,
}: ElementProperties) => {
  const eventsLogger = useEventsLogger();
  const displayIcon = isMainElement ?? isPopupElement;
  const [isHovered, setIsHovered] = useState(false);
  const [portal, setPortal] = useState<HTMLDivElement>();

  const containerUsername = (
    containerForInjection as HTMLElement
  ).dataset.testid?.replace('UserAvatar-Container-', '');
  const username =
    containerUsername === 'unknown' ? undefined : containerUsername;

  const isOrganizationElement = checkForOrganizationBadge(
    containerForInjection,
  );

  const enabled =
    isProfilePage || !!isPopupElement || (isHovered && !!username);

  const yapsQuery = useCommandQuery({
    command: new GetYapsCommand({ username: username ?? '' }),
    enabled,
  });

  const smartFollowersQuery = useCommandQuery({
    command: new GetSmartFollowersCommand({ username: username ?? '' }),
    enabled,
  });

  const noYaps =
    yapsQuery.isLoading ||
    yapsQuery.isError ||
    !!(yapsQuery.data && yapsQuery.data.yaps_all < 0);

  const displayBorder = yapsQuery.data && yapsQuery.data.yaps_all > 0;

  useEffect(() => {
    const cleanup = () => {
      newPortal?.remove();
      container?.remove();
      setPortal(undefined);
    };

    if (!containerForInjection) {
      return;
    }

    if (
      !noYaps &&
      displayIcon &&
      !isOrganizationElement &&
      containerForInjection instanceof HTMLElement
    ) {
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
  }, [
    noYaps,
    displayIcon,
    isMainElement,
    isOrganizationElement,
    containerForInjection,
  ]);

  const onHover = useCallback(() => {
    setIsHovered(true);

    void eventsLogger.track(EVENT.YAPS_STATS_HOVER);
  }, [eventsLogger, setIsHovered]);

  if (
    noYaps ||
    !portal ||
    !username ||
    isOrganizationElement ||
    !containerForInjection
  ) {
    return null;
  }

  return (
    <PortalWithTailwind container={portal}>
      <TradingCopilotTooltip
        onMouseEnter={onHover}
        disableTooltip={!displayIcon}
        triggerClassName="block size-full"
        wrapperClassName="block size-full"
        className={classes(
          'top-full translate-y-4 select-none bg-black px-3 py-2',
          isPopupElement && 'left-0 translate-x-0',
        )}
        content={
          <div className="flex flex-col gap-1">
            <>
              {!yapsQuery.isError && (
                <span>
                  Total Yaps:{' '}
                  {(yapsQuery.isLoading && 'Loading...') ||
                    (yapsQuery.data && Math.round(yapsQuery.data.yaps_all))}
                </span>
              )}

              {!smartFollowersQuery.isError && (
                <span>
                  Smart followers:{' '}
                  {(smartFollowersQuery.isLoading && 'Loading...') ||
                    smartFollowersQuery.data?.num_of_smart_followers}
                </span>
              )}

              {yapsQuery.isError && smartFollowersQuery.isError && (
                <span>no data available</span>
              )}
            </>
          </div>
        }
      >
        <>
          {displayIcon && (
            <img
              alt=""
              src={KAITO_LOGO}
              className={classes(
                'absolute -bottom-4 left-1/2 z-1 size-8 -translate-x-1/2',
                isPopupElement && '-bottom-3 size-6',
              )}
            />
          )}

          {(!isTweetElement || displayBorder) && (
            <span className="absolute right-0 top-0 size-full rounded-full border-2 border-[#32ffdc]" />
          )}
        </>
      </TradingCopilotTooltip>
    </PortalWithTailwind>
  );
};
