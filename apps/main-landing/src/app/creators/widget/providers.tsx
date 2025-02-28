'use client';
import { ReactNode } from 'react';

import { QueryProvider } from '@/providers';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  return <QueryProvider>{children}</QueryProvider>;
};
