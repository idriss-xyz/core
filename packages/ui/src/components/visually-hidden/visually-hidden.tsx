import * as RadixVisuallyHidden from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';

type Properties = {
  children: ReactNode;
};

export const VisuallyHidden = ({ children }: Properties) => {
  return <RadixVisuallyHidden.Root>{children}</RadixVisuallyHidden.Root>;
};
