import { useEffect, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { useCommandMutation, useCommandQuery } from 'shared/messaging';
import { Button, classes, PortalWithTailwind, usePooling } from 'shared/ui';
import {
  AddTradingCopilotSubscriptionCommand,
  GetTradingCopilotSubscriptionsCommand,
  RemoveTradingCopilotSubscriptionCommand,
  SubscriptionRequest,
} from 'application/trading-copilot';
import { Hex } from 'shared/web3';

import { useUserWidgets, useLocationInfo } from '../hooks';
import { TradingCopilotTooltip } from '../notifications-popup/components/trading-copilot-tooltip';

export const FollowTradingCopilot = () => {
  const { wallet } = useWallet();
  const { widgets } = useUserWidgets();
  const { isTwitter, isUserPage, username, isWarpcast } = useLocationInfo();
  const [portal, setPortal] = useState<HTMLDivElement>();

  const widgetsWithMatchingUsername = widgets.filter((widget) => {
    return widget.username === username;
  });

  const userId =
    widgetsWithMatchingUsername.find((widget) => {
      return widget.type === 'idrissSend';
    })?.walletAddress ?? '';

  const enabledForTwitter =
    isTwitter && isUserPage && Boolean(username) && Boolean(userId);

  const enabledForWarpcast =
    isWarpcast && isUserPage && Boolean(username) && Boolean(userId);

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
      subscriberId={wallet.account}
      iconHeight={iconHeight}
      portal={portal}
      className={`p-1.5 ${isWarpcast ? 'mx-1 mt-0.5' : 'mb-3 mr-2'}`}
    />
  );
};

type BadgeProperties = {
  node: HTMLElement;
  userId: Hex;
  isHandleUser: boolean;
};

export const FollowTradingCopilotBadge = ({
  node,
  userId,
  isHandleUser,
}: BadgeProperties) => {
  const { wallet } = useWallet();
  const [portal, setPortal] = useState<HTMLDivElement>();

  useEffect(() => {
    const container = document.createElement('div');
    node.append(container);
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const newPortal = document.createElement('div');
    shadowRoot.append(newPortal);
    setPortal(newPortal);

    return () => {
      newPortal?.remove();
      container?.remove();
      setPortal(undefined);
    };
  }, [node]);

  if (!portal || !wallet || !userId) {
    return;
  }

  const iconSize = isHandleUser ? 17 : 16;

  return (
    <FollowTradingCopilotContent
      userId={userId}
      subscriberId={wallet.account}
      iconHeight={iconSize}
      portal={portal}
      className={isHandleUser ? 'ml-1 p-0' : 'ml-0.5 p-0'}
    />
  );
};

type ContentProperties = {
  userId: Hex;
  subscriberId: Hex;
  iconHeight: number;
  portal: HTMLDivElement;
  className?: string;
};

const FollowTradingCopilotContent = ({
  portal,
  iconHeight,
  subscriberId,
  userId,
  className,
}: ContentProperties) => {
  const subscriptionsQuery = useCommandQuery({
    command: new GetTradingCopilotSubscriptionsCommand({
      subscriberId,
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { isWarpcast } = useLocationInfo();

  const isSubscribed = subscriptionsQuery?.data?.details.some((detail) => {
    return detail.address.toLowerCase() === userId.toLowerCase();
  });

  const subscribe = useCommandMutation(AddTradingCopilotSubscriptionCommand);
  const unsubscribe = useCommandMutation(
    RemoveTradingCopilotSubscriptionCommand,
  );

  const handleSubscribe = async (
    address: SubscriptionRequest['subscription']['address'],
  ) => {
    await subscribe.mutateAsync({
      subscription: { address, subscriberId },
      authToken: localStorage.getItem('authToken') ?? '',
    });
    void subscriptionsQuery.refetch();
  };

  const handleUnsubscribe = async (
    address: SubscriptionRequest['subscription']['address'],
  ) => {
    await unsubscribe.mutateAsync({
      subscription: { address, subscriberId },
      authToken: localStorage.getItem('authToken') ?? '',
    });
    void subscriptionsQuery.refetch();
  };

  const onClickHandler = async () => {
    await (isSubscribed ? handleUnsubscribe(userId) : handleSubscribe(userId));
  };

  const tooltipContent = (
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
        className={`custom-transition ${isSubscribed ? '!w-[11.25rem]' : '!w-[165px]'} ${isWarpcast ? 'translate-y-[-55px]' : 'translate-y-[-70px]'}`}
      >
        <Button
          onClick={onClickHandler}
          className={classes(
            'relative flex cursor-pointer overflow-hidden rounded-full border-none outline-none transition delay-300 duration-300',
            'bg-[#eff3f4] hover:bg-[#d7dbdc]',
            className,
          )}
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
