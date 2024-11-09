'use client';
import { ProductSection } from '../product-section';

import { PredictionMarketsSectionData } from './prediction-markets-section-data';

type Properties = {
  className?: string;
  fadeOut: boolean;
};

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
    />
  );
};
