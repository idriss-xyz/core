import { ReactNode } from 'react';

type Properties = {
  children?: ReactNode;
};

export const SettingsLayoutBody = ({ children }: Properties) => {
  return <div className="px-6">{children}</div>;
};
