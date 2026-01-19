import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { siteMap } from '../constants';

/**
 * Client-side hook that updates the document title based on the current pathname
 */
export function usePageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove /app prefix if present
    const cleanPath = pathname.replace(/^\/app\/?/, '');

    if (!cleanPath) {
      document.title = 'IDRISS - Home';
      return;
    }

    const pathSegments = cleanPath.split('/').filter(Boolean);
    const titles: string[] = [];

    // Helper to find sitemap item
    const findSiteMapItem = (items: typeof siteMap, segment: string) => {
      return items.find((item) => {
        return item.path === segment;
      });
    };

    // Build title from path segments
    let currentItems = siteMap;
    for (const segment of pathSegments) {
      const item = findSiteMapItem(currentItems, segment);
      if (item) {
        titles.push(item.name);
        currentItems = item.children ?? [];
      }
    }

    // If we found titles, set them joined with IDRISS
    if (titles.length > 0) {
      document.title = `IDRISS - ${titles.join(' - ')}`;
    } else {
      // Fallback to formatted path segment
      const lastSegment = pathSegments.at(-1);
      if (lastSegment) {
        const formatted = lastSegment
          .split('-')
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        document.title = `IDRISS - ${formatted}`;
      } else {
        document.title = 'IDRISS';
      }
    }
  }, [pathname]);
}
