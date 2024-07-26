import { ReactNode } from 'react';

import { WidgetBaseProperties } from '../widget-base/widget-base.types';

export interface WidgetTabProperties extends WidgetBaseProperties {
  userHandle: string;
  tabName: string;
  tabImage?: string;
  children: ReactNode;
  theme: 'bright' | 'dark';
}
