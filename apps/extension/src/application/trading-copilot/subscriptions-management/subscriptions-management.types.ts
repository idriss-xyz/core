import { MutableRefObject } from 'react';

export interface Properties {
  isTabChangedListenerAdded: MutableRefObject<boolean>;
}

export interface ContentProperties extends Properties {
  subscriberId: string;
}
