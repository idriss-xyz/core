import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-use';

import { FarcasterButton, GetFollowersCommand } from 'shared/farcaster';
import { useCommandQuery } from 'shared/messaging';
import { classes, PortalWithTailwind, usePooling } from 'shared/ui';
import { getWarpcastUserLink } from 'host/warpcast';
import { FARCASTER_LOGO } from 'assets/images';
import { useEventsLogger } from 'shared/observability';
import { createLookup } from 'shared/utils';

import { useLocationInfo } from '../hooks';

const EVENT = createLookup(['FOLLOW_ON_FC_CLICKED']);

export const FollowOnFarcaster = () => {
  const { isTwitter, isUserPage, username } = useLocationInfo();
  const location = useLocation();
  const [portal, setPortal] = useState<HTMLDivElement>();

  const eventsLogger = useEventsLogger();

  const enabled = isTwitter && isUserPage && Boolean(username);

  const followersQuery = useCommandQuery({
    command: new GetFollowersCommand({}),
    enabled: enabled,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const maybeUserData = useMemo(() => {
    if (!username) {
      return;
    }

    const foundEntry = Object.entries(followersQuery.data ?? {}).find(
      ([, userData]) => {
        return userData.twitter.toLowerCase() === username.toLowerCase();
      },
    );

    if (!foundEntry) {
      return;
    }

    const [farcasterName, userData] = foundEntry;
    return { ...userData, farcasterName };
  }, [followersQuery.data, username]);

  const childOfContainerForInjection = usePooling<Element | null>({
    callback: () => {
      return (
        document.querySelector('[data-testid="userActions"]') ??
        document.querySelector('[data-testid="editProfileButton"]')
      );
    },
    defaultValue: null,
    enabled: Boolean(maybeUserData),
    interval: 1000,
  });

  useEffect(() => {
    const cleanup = () => {
      newPortal?.remove();
      container?.remove();
      setPortal(undefined);
    };
    if (!maybeUserData) {
      return cleanup;
    }

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
  }, [
    maybeUserData,
    location.pathname,
    childOfContainerForInjection?.parentElement,
  ]);

  const goToUserPage = useCallback(() => {
    if (!maybeUserData) {
      return;
    }
    void eventsLogger.track(EVENT.FOLLOW_ON_FC_CLICKED);
    const url = getWarpcastUserLink(maybeUserData.farcasterName);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [eventsLogger, maybeUserData]);

  if (!portal || !childOfContainerForInjection) {
    return null;
  }

  const otherButtonsHeight =
    childOfContainerForInjection.getBoundingClientRect().height;
  const isSmallVariant = otherButtonsHeight <= 32;

  const iconHeight = isSmallVariant ? 20 : 24;

  // some weird styles in the button are there to replicate buttons from Twitter which have weird styling method themself (like margin-bottom for centering)
  return (
    <PortalWithTailwind container={portal}>
      <FarcasterButton
        className={classes('mb-3 mr-2 flex cursor-pointer rounded-full p-1.5')}
        onClick={goToUserPage}
        title="Follow on Farcaster"
      >
        <img
          src={FARCASTER_LOGO}
          alt=""
          width={iconHeight}
          height={iconHeight}
        />
      </FarcasterButton>
    </PortalWithTailwind>
  );
};
