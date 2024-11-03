'use client';
import { useBreakpoint } from '@idriss-xyz/ui/hooks';
import { useMemo } from 'react';

import { Desktop } from './desktop';
import { Mobile } from './mobile';

export const Navigation = () => {
  const breakpoint = useBreakpoint();
  const isDesktop = useMemo(() => {
    return ['laptop', 'laptopL'].includes(breakpoint);
  }, [breakpoint]);

  if (isDesktop) {
    return <Desktop />;
  }

  return <Mobile />;
};
