import { memo } from 'react';

import { ErrorBoundary } from 'shared/observability';

import { useRecipients } from '../hooks/use-recipients';
import { getIconSource } from '../utils';

import { SendWidget } from './send-widget';

interface Properties {
  handle?: string;
}

function isHandleNode(element: HTMLElement) {
  let currentElement: HTMLElement | null = element;
  for (let index = 0; index < 10; index++) {
    currentElement = currentElement.parentElement;
    if (!currentElement) {
      return false; // If there are less than 3 parents
    }
    if (currentElement.dataset.testid === 'UserName') {
      return true;
    }
  }
  return false;
}

export const SendWidgetContainer = memo(({ handle }: Properties) => {
  const { recipients } = useRecipients();

  return recipients.map(
    ({
      username,
      node,
      top,
      walletAddress,
      availableNetworks,
      widgetOverrides,
    }) => {
      const isHandleUser =
        handle === username && isHandleNode(node as HTMLElement);
      const nodeToInject: HTMLElement | null = isHandleUser
        ? node.querySelector('div > div > div > span') ??
          node.querySelector('div > div > a > div')
        : node.querySelector('div > div > a > div') ??
          node.querySelector('div:has(> div > span)');

      if (!nodeToInject || nodeToInject?.textContent === 'Follows you') {
        return null;
      }

      return (
        <ErrorBoundary
          key={`${username}-${top}`}
          exceptionEventName="idriss-send-widget"
        >
          <SendWidget
            availableNetworks={availableNetworks}
            recipientAddress={walletAddress ?? '0x'}
            username={username}
            node={nodeToInject}
            iconSize={isHandleUser ? 22 : 16}
            iconSrc={getIconSource(widgetOverrides?.iconType ?? 'default')}
            sendButtonCopy={widgetOverrides?.sendButtonCopy}
            headerCopy={widgetOverrides?.headerCopy}
          />
        </ErrorBoundary>
      );
    },
  );
});

SendWidgetContainer.displayName = 'SendWidgetContainer';
