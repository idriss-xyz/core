import * as Portal from '@radix-ui/react-portal';
import { ReactNode } from 'react';

import { TailwindProvider } from '../../providers';

type Properties = {
  container: Element;
  children: ReactNode;
};

/**
 * Injects react component to given container and wraps it with tailwind css.
 *
 * Example usecase - injecting outside of shadow-dom.
 * Tailwind styles live inside shadow dom, injecting components outside of shadow dom results in lack of tailwind styles.
 * This Wrapper fixes this issue.
 *
 */
export const PortalWithTailwind = ({ children, container }: Properties) => {
  return (
    <Portal.Root container={container}>
      <TailwindProvider>{children}</TailwindProvider>
    </Portal.Root>
  );
};
