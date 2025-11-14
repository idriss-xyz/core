import * as React from 'react';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

export type SiteMapItem = {
  name: string;
  path: string;
  children?: SiteMapItem[];
};

type BreadcrumbNavigationProperties = {
  pathname: string;
  siteMap: SiteMapItem[];
  basePath?: string; // Optional base path prefix
};

export function BreadcrumbNavigation({
  pathname,
  siteMap,
  basePath = '',
}: BreadcrumbNavigationProperties) {
  // Generate breadcrumb items based on current pathname and site structure
  const breadcrumbItems = React.useMemo(() => {
    const items: { name: string; path: string; isCurrentPage: boolean }[] = [];

    // If we have a base path, we need to handle it specially
    if (basePath) {
      // Remove the base path from the pathname for processing
      const relativePath = pathname.startsWith(basePath)
        ? pathname.slice(basePath.length) || '/'
        : pathname;

      if (relativePath === '/') {
        return items;
      }

      // Split the relative pathname into segments
      const segments = relativePath.split('/').filter(Boolean);

      // Build the breadcrumb trail by traversing the site map
      let currentPath = '';
      let currentItems = siteMap;

      for (const segment of segments) {
        currentPath += `/${segment}`;

        // Find the matching item in the current level of the site map
        const matchingItem = currentItems.find((item) => {
          // Check if this item's path matches the current path segment
          const itemPathSegments = item.path.split('/').filter(Boolean);
          return itemPathSegments.at(-1) === segment;
        });

        if (matchingItem) {
          // Construct the full path by combining base path with the item's path
          const fullPath = `${basePath}${currentPath}`;

          items.push({
            name: matchingItem.name,
            path: fullPath,
            isCurrentPage: `${basePath}${currentPath}` === pathname,
          });

          // Move to the next level of the site map if there are children
          if (matchingItem.children) {
            currentItems = matchingItem.children;
          }
        }
      }
    } else {
      // Original logic when no base path is provided

      if (pathname === '/') {
        return items;
      }

      // Split the pathname into segments
      const segments = pathname.split('/').filter(Boolean);

      // Build the breadcrumb trail by traversing the site map
      let currentPath = '';
      let currentItems = siteMap;

      for (const segment of segments) {
        currentPath += `/${segment}`;

        // Find the matching item in the current level of the site map
        const matchingItem = currentItems.find((item) => {
          // Check if this item's path matches the current path segment
          const itemPathSegments = item.path.split('/').filter(Boolean);
          return itemPathSegments.at(-1) === segment;
        });

        if (matchingItem) {
          items.push({
            name: matchingItem.name,
            path: currentPath,
            isCurrentPage: currentPath === pathname,
          });

          // Move to the next level of the site map if there are children
          if (matchingItem.children) {
            currentItems = matchingItem.children;
          }
        }
      }
    }

    if (
      items.length === 1 &&
      items[0]?.isCurrentPage &&
      ['profile', 'invites'].includes(items[0].path.split('/').pop() ?? '')
    ) {
      items.unshift({ name: 'Home', path: '/', isCurrentPage: false });
    }

    return items;
  }, [pathname, siteMap, basePath]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          return (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {/* If we want navigation, render <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink> instead */}
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
