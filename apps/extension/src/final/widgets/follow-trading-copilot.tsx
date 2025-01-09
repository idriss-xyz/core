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

export const FollowTradingCopilot = () => {
  const { wallet } = useWallet();
  const { widgets } = useUserWidgets();
  const { isTwitter, isUserPage, username } = useLocationInfo();
  const [portal, setPortal] = useState<HTMLDivElement>();

  const userId =
    widgets.find((widget) => {
      return widget.type === 'idrissSend';
    })?.walletAddress ?? '';

  const enabled =
    isTwitter && isUserPage && Boolean(username) && Boolean(userId);

  const childOfContainerForInjection = usePooling<Element | null>({
    callback: () => {
      return (
        document.querySelector('[data-testid="userActions"]') ??
        document.querySelector('[data-testid="editProfileButton"]')
      );
    },
    defaultValue: null,
    interval: 1000,
    enabled,
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
  }, [childOfContainerForInjection?.parentElement]);

  if (
    !portal ||
    !childOfContainerForInjection ||
    !wallet ||
    !enabled ||
    !userId
  ) {
    return;
  }

  const otherButtonsHeight =
    childOfContainerForInjection.getBoundingClientRect().height;
  const isSmallVariant = otherButtonsHeight <= 32;

  const iconHeight = isSmallVariant ? 20 : 24;

  return (
    <FollowTradingCopilotContent
      userId={userId}
      subscriberId={wallet.account}
      iconHeight={iconHeight}
      portal={portal}
      className="mb-3 mr-2 p-1.5"
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

  return (
    <PortalWithTailwind container={portal}>
      <Button
        onClick={onClickHandler}
        className={classes(
          'flex cursor-pointer rounded-full bg-[#eff3f4] hover:bg-[#d7dbdc]',
          className,
        )}
        title={
          isSubscribed
            ? 'Unsubscribe in trading copilot'
            : 'Subscribe in trading copilot'
        }
      >
        <Icon
          name="Plus"
          size={iconHeight}
          className={`text-[#0f1419] transition-transform duration-300 ${isSubscribed ? 'rotate-45' : ''}`}
        />
      </Button>
    </PortalWithTailwind>
  );
};
