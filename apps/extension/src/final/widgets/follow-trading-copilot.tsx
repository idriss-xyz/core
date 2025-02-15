import { useEffect, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { Hex } from 'viem';

import { Button, classes, PortalWithTailwind, usePooling } from 'shared/ui';
import {
  SubscribePayload,
  UnsubscribePayload,
  useSubscriptions,
} from 'application/trading-copilot';
import { Wallet } from 'shared/web3';
import { useWallet } from 'shared/extension';
import { GetFarcasterVerifiedAddressCommand } from 'shared/farcaster';
import { useCommandQuery } from 'shared/messaging';

import { useLocationInfo } from '../hooks';
import { TradingCopilotTooltip } from '../notifications-popup/components/trading-copilot-tooltip';

export const FollowTradingCopilot = () => {
  const { wallet } = useWallet();
  const { isTwitter, isUserPage, username, isWarpcast, isConversation } =
    useLocationInfo();
  const [portal, setPortal] = useState<HTMLDivElement>();

  const getFarcasterAddressQuery = useCommandQuery({
    command: new GetFarcasterVerifiedAddressCommand({
      name: username ?? '',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!username,
  });

  const userId = getFarcasterAddressQuery.data?.address;

  const enabledForTwitter =
    isTwitter && isUserPage && Boolean(username) && Boolean(userId);

  const enabledForWarpcast =
    isWarpcast &&
    isUserPage &&
    Boolean(username) &&
    Boolean(userId) &&
    !isConversation;

  const childOfContainerForInjectionOnTwitter = usePooling<Element | null>({
    callback: () => {
      return (
        document.querySelector('[data-testid="userActions"]') ??
        document.querySelector('[data-testid="editProfileButton"]')
      );
    },
    defaultValue: null,
    interval: 1000,
    enabled: enabledForTwitter,
  });

  const childOfContainerForInjectionOnWarpcast = usePooling<Element | null>({
    callback: () => {
      return document.querySelector('[aria-haspopup="menu"]');
    },
    defaultValue: null,
    interval: 1000,
    enabled: enabledForWarpcast,
  });

  const isOwnProfile = !!usePooling<Element | null>({
    callback: () => {
      return document.querySelector('[href="/~/settings"] button');
    },
    defaultValue: null,
    interval: 1000,
    enabled: enabledForWarpcast,
  });

  useEffect(() => {
    const cleanup = () => {
      newPortal?.remove();
      container?.remove();
      setPortal(undefined);
    };

    const buttonsContainer = isTwitter
      ? childOfContainerForInjectionOnTwitter?.parentElement
      : childOfContainerForInjectionOnWarpcast?.parentElement;
    const followButton = isTwitter
      ? buttonsContainer?.lastElementChild
      : buttonsContainer?.firstChild;

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
    isTwitter,
    childOfContainerForInjectionOnTwitter?.parentElement,
    childOfContainerForInjectionOnWarpcast?.parentElement,
  ]);

  if (
    !portal ||
    (!childOfContainerForInjectionOnTwitter &&
      !childOfContainerForInjectionOnWarpcast) ||
    !wallet ||
    (!enabledForTwitter && !enabledForWarpcast) ||
    (enabledForWarpcast && isOwnProfile) ||
    !userId
  ) {
    return;
  }

  const otherButtonsHeight = enabledForTwitter
    ? (childOfContainerForInjectionOnTwitter?.getBoundingClientRect().height ??
      20)
    : 20;
  const isSmallVariant = otherButtonsHeight <= 32;

  const iconHeight = isSmallVariant ? 20 : 24;

  return (
    <FollowTradingCopilotContent
      userId={userId}
      iconHeight={iconHeight}
      portal={portal}
      wallet={wallet}
      className={`p-1.5 ${isWarpcast ? 'mx-1 mt-0.5' : 'mb-3 mr-2'}`}
    />
  );
};

type ContentProperties = {
  userId: Hex;
  wallet: Wallet;
  iconHeight: number;
  className?: string;
  portal: HTMLDivElement;
};

const FollowTradingCopilotContent = ({
  userId,
  wallet,
  portal,
  className,
  iconHeight,
}: ContentProperties) => {
  const { subscriptions, subscribe, unsubscribe, canSubscribe } =
    useSubscriptions({
      wallet,
    });

  const handleUnsubscribe = (payload: UnsubscribePayload) => {
    return unsubscribe.use(payload);
  };

  const handleSubscribe = (payload: SubscribePayload) => {
    return subscribe.use(payload);
  };

  const isSubscribed = subscriptions.data?.details.some((detail) => {
    return detail.address.toLowerCase() === userId.toLowerCase();
  });

  const isButtonDisabled = !isSubscribed && !canSubscribe;

  const onClickHandler = async () => {
    await (isSubscribed
      ? handleUnsubscribe({ address: userId })
      : handleSubscribe({ address: userId }));
  };

  const tooltipContent = isButtonDisabled ? (
    <span className="relative opacity-100 transition delay-200 duration-500">
      Maximum subscriptions reached.
    </span>
  ) : (
    <>
      <span
        className={`absolute opacity-0 transition duration-500 ${isSubscribed ? 'opacity-100 delay-200' : 'opacity-0 delay-0'}`}
      >
        Unsubscribe in trading copilot
      </span>
      <span
        className={`relative transition duration-500 ${isSubscribed ? 'opacity-0 delay-0' : 'opacity-100 delay-200'}`}
      >
        Subscribe in trading copilot
      </span>
    </>
  );

  return (
    <PortalWithTailwind container={portal}>
      <TradingCopilotTooltip
        content={tooltipContent}
        className={`custom-transition -translate-y-6 ${isSubscribed ? '!w-[11.25rem]' : '!w-[165px]'}`}
      >
        <Button
          onClick={onClickHandler}
          className={classes(
            'relative flex overflow-hidden rounded-full outline-none transition delay-300 duration-300',
            'border border-[#cfd9de] bg-white hover:bg-[##0f14191a]',
            isButtonDisabled
              ? 'cursor-not-allowed border-[#808080]'
              : 'cursor-pointer',
            className,
          )}
          disabled={isButtonDisabled}
        >
          <Icon
            name="Rocket"
            size={iconHeight}
            className={`text-[#0f1419] transition duration-500 ${isSubscribed ? '-translate-y-6 translate-x-6 delay-0' : 'delay-[400ms]'}`}
          />
          <Icon
            name="Plus"
            size={iconHeight}
            className={`absolute rotate-45 text-[#0f1419] opacity-0 transition duration-300 ${isSubscribed ? 'opacity-100 delay-[400ms]' : 'opacity-0 delay-0'}`}
          />
        </Button>
      </TradingCopilotTooltip>
    </PortalWithTailwind>
  );
};
