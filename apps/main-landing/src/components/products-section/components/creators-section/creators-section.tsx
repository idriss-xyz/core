import { ProductSection } from '../product-section';

import { CreatorsSectionData } from './creators-section-data';

type Properties = {
  className?: string;
  fadeOut: boolean;
};

export const CreatorsSection = ({ className, fadeOut }: Properties) => {
  return (
    <ProductSection
      fadeOut={fadeOut}
      className={className}
      actions={CreatorsSectionData.actions}
      activeOptionKey={CreatorsSectionData.defaultOptionKey}
      description={CreatorsSectionData.info.description}
      title={CreatorsSectionData.info.title}
      features={CreatorsSectionData.info.features}
      tabsAsLinks={false}
    />
  );
};
