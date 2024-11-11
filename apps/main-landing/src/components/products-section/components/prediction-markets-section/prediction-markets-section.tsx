'use client';
import { ProductSection } from '../product-section';

import { PredictionMarketsSectionData } from './prediction-markets-section-data';

type Properties = {
  className?: string;
  fadeOut: boolean;
};

const CIRCLE_IMAGE_PATH =
  'extension-to-prediction-markets-circle-optimized/IDRISS_CIRCLE_0038.webp';

export const PredictionMarketsSection = ({
  className,
  fadeOut,
}: Properties) => {
  return (
    <ProductSection
      fadeOut={fadeOut}
      className={className}
      actions={PredictionMarketsSectionData.actions}
      activeOptionKey={PredictionMarketsSectionData.defaultOptionKey}
      description={PredictionMarketsSectionData.info.description}
      title={PredictionMarketsSectionData.info.title}
      features={PredictionMarketsSectionData.info.features}
      tabsAsLinks
      animated={false}
      circleImage={CIRCLE_IMAGE_PATH}
    />
  );
};
