import { useCallback } from 'react';

import { usePooling } from 'shared/ui/hooks';

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

  return { nodes: value };
};

export const useTwitterExternalLinksPooling = () => {
  const poolUsers = useCallback(() => {
    return Twitter.getExternalLinksNodes();
  }, []);

  const { value } = usePooling({
    defaultValue: [],
    callback: poolUsers,
  });

  const links = value
    .map((node) => {
      const { height, top } = node.getBoundingClientRect();
      if (height === 0) {
        return;
      }

      const url = node.getAttribute('href');

      if (!url) {
        return;
      }

      return { node, url, top: top + window.scrollY };
    })
    .filter(Boolean);

  return { links };
};
