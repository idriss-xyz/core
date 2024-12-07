'use client';

import { useState, useEffect, useRef } from 'react';

import { QueryProvider } from '@/providers';

import { DesktopProductsSection, MobileProductsSection } from './components';

export const ProductsSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    const handleInitialScroll = () => {
      if (isFirstRender.current) {
        const hash = window.location.hash;
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView();
          }
        }
        isFirstRender.current = false;
      }
    };

    // Run initial scroll after a short delay to ensure render
    const timeoutId = setTimeout(handleInitialScroll, 200);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

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
