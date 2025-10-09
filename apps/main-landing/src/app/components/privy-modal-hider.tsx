'use client';

import { useEffect } from 'react';

export function PrivyModalHider() {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        console.log('Mutation detected', mutation);
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.id === 'headlessui-portal-root') {
              node.style.display = 'none';
              node.style.visibility = 'hidden';
              node.style.opacity = '0';
            }

            // Also check children
            const portalRoot = node.querySelector('#headlessui-portal-root')!;
            if (portalRoot instanceof HTMLElement) {
              portalRoot.style.display = 'none';
              portalRoot.style.visibility = 'hidden';
              portalRoot.style.opacity = '0';
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup on unmount
    return () => {
      return observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
