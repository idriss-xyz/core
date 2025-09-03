import { ReactNode } from 'react';

interface Properties {
  children: ReactNode;
}

export const Heading = ({ children }: Properties) => {
  return (
    <p className="truncate text-heading5 text-neutralGreen-900">{children}</p>
  );
};
