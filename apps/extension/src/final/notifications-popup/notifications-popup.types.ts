import { MutableRefObject } from 'react';

import { SwapData } from 'application/trading-copilot';

export interface Properties {
  isSwapEventListenerAdded: MutableRefObject<boolean>;
}

export interface ContentProperties extends Properties {
  closeDialog: () => void;
  activeDialog: SwapData | null;
  openDialog: (dialog: SwapData) => void;
}
