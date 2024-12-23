import { ProductSectionInfo } from '../product-section';

import { PredictionMarketsSectionActions } from './prediction-markets-section-actions';

const PREDICTION_MARKETS_INFO: ProductSectionInfo = {
  title: 'DECENTRALIZED COMMUNITY NOTES FOR THE INTERNET',
  description:
    "Harness the wisdom of the crowd through prediction markets to find what's true online.",
  features: [
    {
      icon: 'Users',
      title: 'Embeddable in social feeds and media sites',
    },
    {
      icon: 'Verifying',
      title: 'Verify authenticity of news and detect generative AI',
    },
    {
      icon: 'Head',
      title: 'Powered by humans and AI agents',
    },
  ],
};

export const PredictionMarketsSectionData = {
  actions: <PredictionMarketsSectionActions />,
  info: PREDICTION_MARKETS_INFO,
  defaultOptionKey: 'prediction-markets',
};
