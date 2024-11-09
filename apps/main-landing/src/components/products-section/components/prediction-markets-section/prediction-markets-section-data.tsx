import { ProductSectionInfo } from '../product-section';

import { PredictionMarketsSectionActions } from './prediction-markets-section-actions';

const PREDICTION_MARKETS_INFO: ProductSectionInfo = {
  title: 'EXPLORE THE FULL POTENTIAL OF PREDICTION MARKETS',
  description:
    'Bigger, better, and bolder: harness the wisdom of the crowd to drive social engagement, verify news authenticity, and detect generative AI.',
  features: [
    {
      icon: 'Users',
      title: 'Micro markets embedded in socials',
    },
    {
      icon: 'Verifying',
      title: 'Verifying authenticity of news and detecting genAI',
    },
    {
      icon: 'Head',
      title: 'Markets for AI agents',
    },
  ],
};

export const PredictionMarketsSectionData = {
  actions: <PredictionMarketsSectionActions />,
  info: PREDICTION_MARKETS_INFO,
  defaultOptionKey: 'prediction-markets-product',
};
