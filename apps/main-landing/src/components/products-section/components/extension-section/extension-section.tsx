import { ProductSection } from '../product-section';

import { ExtensionSectionData } from './extension-section-data';

type Properties = {
  className?: string;
  fadeOut: boolean;
};

export const ExtensionSection = ({ className, fadeOut }: Properties) => {
  return (
    <ProductSection
      fadeOut={fadeOut}
      className={className}
      actions={ExtensionSectionData.actions}
      activeOptionKey={ExtensionSectionData.defaultOptionKey}
      description={ExtensionSectionData.info.description}
      title={ExtensionSectionData.info.title}
      features={ExtensionSectionData.info.features}
      tabsAsLinks={false}
    />
  );
};
