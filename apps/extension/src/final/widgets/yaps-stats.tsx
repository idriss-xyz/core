import { useCallback, useEffect, useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import {
  classes,
  PortalWithTailwind,
  TradingCopilotTooltip,
  usePooling,
} from 'shared/ui';
import { useEventsLogger } from 'shared/observability';
import { createLookup } from 'shared/utils';
import { GetYapsCommand, checkForOrganizationBadge } from 'application/kaito';
import { KAITO_LOGO } from 'assets/images';
import { useExtensionSettings } from 'shared/extension';

import { useLocationInfo } from '../hooks';

const EVENT = createLookup(['YAPS_STATS_HOVER']);

export const YapsStats = () => {
  const { isTwitter } = useLocationInfo();
  const { extensionSettings } = useExtensionSettings();

  const isEnabled = isTwitter && extensionSettings['kaito-enabled'];

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
    enabled: isEnabled,
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
    enabled: isEnabled,
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
    enabled: isEnabled,
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
  const displayTooltip = isMainElement ?? isPopupElement;
  const { username: locationUsername } = useLocationInfo();
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
    (isProfilePage && username === locationUsername) ||
    (isHovered && !!username);

  const yapsQuery = useCommandQuery({
    command: new GetYapsCommand({ username: username ?? '' }),
    staleTime: Number.POSITIVE_INFINITY,
    retryDelay: 10000,
    enabled,
  });

  const noYaps =
    yapsQuery.isLoading ||
    yapsQuery.isError ||
    !!(yapsQuery.data && yapsQuery.data.yaps_all < 0);

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
      isMainElement &&
      !isOrganizationElement &&
      containerForInjection instanceof HTMLElement
    ) {
      containerForInjection.style.marginBottom = '24px';
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
  }, [noYaps, isMainElement, isOrganizationElement, containerForInjection]);

  const onHover = useCallback(() => {
    setIsHovered(true);

    void eventsLogger.track(EVENT.YAPS_STATS_HOVER);
  }, [eventsLogger, setIsHovered]);

  if (!portal || !username || isOrganizationElement || !containerForInjection) {
    return null;
  }

  return (
    <PortalWithTailwind container={portal}>
      <TradingCopilotTooltip
        onMouseEnter={onHover}
        disableTooltip={!displayTooltip}
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

              {yapsQuery.isError && <span>No data available</span>}
            </>
          </div>
        }
      >
        <>
          {isMainElement && !noYaps && (
            <img
              alt=""
              src={KAITO_LOGO}
              className="absolute -bottom-4 left-1/2 z-1 size-8 -translate-x-1/2"
            />
          )}

          {!isTweetElement && !isPopupElement && !noYaps && (
            <span className="absolute right-0 top-0 size-full rounded-full border-2 border-[#32ffdc]" />
          )}
        </>
      </TradingCopilotTooltip>
    </PortalWithTailwind>
  );
};
