import { ReactNode } from 'react';

import { SettingsLayoutHeader } from './settings-layout-header';
import { SettingsLayoutBody } from './settings-layout-body';

type Properties = {
  children: ReactNode;
};

const Base = ({ children }: Properties) => {
  return <div className="pb-2 text-black">{children}</div>;
};

export const SettingsLayout = Object.assign(Base, {
  Header: SettingsLayoutHeader,
  Body: SettingsLayoutBody,
});
