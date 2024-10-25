import { ReactNode } from 'react';

interface Properties {
  children: ReactNode;
}

export const Heading = ({ children }: Properties) => {
  return <p className="truncate text-lg font-medium leading-6">{children}</p>;
};
