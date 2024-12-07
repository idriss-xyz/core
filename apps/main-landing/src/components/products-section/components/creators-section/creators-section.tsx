import { ProductSection } from '../product-section';

import { CreatorsSectionData } from './creators-section-data';

type Properties = {
  className?: string;
  fadeOut: boolean;
};

const CIRCLE_IMAGE_PATH =
  'extension-to-prediction-markets-circle-optimized/IDRISS_CIRCLE_0095.webp';

export const CreatorsSection = ({ className, fadeOut }: Properties) => {
  return (
    <ProductSection
      tabsVisibile={false}
      fadeOut={fadeOut}
      className={className}
      actions={CreatorsSectionData.actions}
      activeOptionKey={CreatorsSectionData.defaultOptionKey}
      description={CreatorsSectionData.info.description}
      title={CreatorsSectionData.info.title}
      features={CreatorsSectionData.info.features}
      tabsAsLinks
      animated={false}
      circleImage={CIRCLE_IMAGE_PATH}
    />
  );
};
