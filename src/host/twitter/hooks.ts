import { useCallback, useMemo } from 'react';

import { usePooling } from 'shared/ui';

import { Twitter } from './twitter';

export const useTwitterUsersPooling = () => {
  const poolUsers = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Twitter.getUsernamesNodes();
  }, []);

  const { value } = usePooling({
    defaultValue: [],
    callback: poolUsers,
  });

  const results = useMemo(() => {
    return value
      .map((node) => {
        const linkNode = node.querySelector('a');

        if (!linkNode) {
          return;
        }

        const username = linkNode.getAttribute('href')?.replace('/', '');
        if (!username) {
          return;
        }

        const linkNodeRect = linkNode.getBoundingClientRect();
        if (!linkNodeRect.height) {
          return;
        }

        return {
          node,
          username,
          top: linkNodeRect.top + window.scrollY,
        };
      })
      .filter(Boolean);
  }, [value]);

  return { results };
};

export const useTwitterExternalLinksPooling = () => {
  const poolExternalLinks = useCallback(() => {
    return Twitter.getExternalLinksNodes();
  }, []);

  const { value } = usePooling({
    defaultValue: [],
    callback: poolExternalLinks,
  });

  const results = useMemo(() => {
    return value
      .map((node) => {
        const { height, top } = node.getBoundingClientRect();
        if (!height) {
          return;
        }

        const url = node.getAttribute('href');

        if (!url) {
          return;
        }

        return { node, url, top: top + window.scrollY };
      })
      .filter(Boolean);
  }, [value]);

  return { results };
};
