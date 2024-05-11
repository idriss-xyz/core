import { useCallback, useMemo } from 'react';

import { usePooling } from 'shared/ui';

import { Warpcast } from './warpcast';

export const useWarpcastExternalLinksPooling = () => {
  const poolExternalLinks = useCallback(() => {
    return Warpcast.getExternalLinksNodes();
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
