import { ProductSection } from '../product-section';

import { ExtensionSectionData } from './extension-section-data';

type Properties = {
  className?: string;
  headerClassName?: string;
  fadeOut: boolean;
};

const CIRCLE_IMAGE_PATH =
  'extension-to-prediction-markets-circle-optimized/IDRISS_CIRCLE_0150.webp';

export const ExtensionSection = ({
  className,
  headerClassName,
  fadeOut,
}: Properties) => {
  return (
    <ProductSection
      tabsVisibile={false}
      fadeOut={fadeOut}
      className={className}
      headerClassName={headerClassName}
      actions={ExtensionSectionData.actions}
      activeOptionKey={ExtensionSectionData.defaultOptionKey}
      description={ExtensionSectionData.info.description}
      title={ExtensionSectionData.info.title}
      features={ExtensionSectionData.info.features}
      tabsAsLinks
      animated={false}
      circleImage={CIRCLE_IMAGE_PATH}
    />
  );
};
