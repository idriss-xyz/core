import { ProductSectionInfo } from '../product-section';

import { ExtensionSectionActions } from './extension-section-actions';

const BROWSER_EXTENSION_INFO: ProductSectionInfo = {
  title: 'CRYPTO AND AI EXPANSION PACK FOR YOUR BROWSER',
  description:
    'Enhance your browsing experience with crypto micropayments, DAO vote alerts, and trading widgets directly in your browser.',
  features: [
    {
      icon: 'Tipping',
      title: 'Tipping badges',
      description: 'Send and receive crypto on X and Farcaster',
    },
    {
      icon: 'Governance',
      title: 'Governance widget',
      description:
        'Get alerts for active DAO votes on Agora, Snapshot, and Tally',
    },
    {
      icon: 'PolymarketIcon',
      title: 'Polymarket widget',
      description: 'Bet on Polymarket directly from your X feed',
    },
    {
      icon: 'Trading',
      title: 'Trading copilot',
      description: 'Copy onchain moves of your favorite traders',
    },
  ],
};

export const ExtensionSectionData = {
  actions: <ExtensionSectionActions />,
  info: BROWSER_EXTENSION_INFO,
  defaultOptionKey: 'extension',
};
