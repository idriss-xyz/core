'use client';

import { useWindowSize } from 'react-use';

import { QueryProvider } from '@/providers';

import { DesktopProductsSection, MobileProductsSection } from './components';

export const ProductsSection = () => {
  const windowSize = useWindowSize(1024);

  const isMobile = windowSize.width < 1024;

  return (
    <QueryProvider>
      {isMobile ? (
        <MobileProductsSection className="flex lg:hidden" />
      ) : (
        <DesktopProductsSection className="hidden lg:flex" />
      )}
    </QueryProvider>
  );
};
