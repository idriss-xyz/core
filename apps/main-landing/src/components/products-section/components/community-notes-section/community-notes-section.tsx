'use client';
import { ProductSection } from '../product-section';

import { CommunityNotesSectionData } from './community-notes-section-data';

type Properties = {
  className?: string;
  fadeOut: boolean;
};

const CIRCLE_IMAGE_PATH =
  'extension-to-community-notes-circle-optimized/IDRISS_CIRCLE_0038.webp';

export const CommunityNotesSection = ({ className, fadeOut }: Properties) => {
  return (
    <ProductSection
      tabsVisibile={false}
      fadeOut={fadeOut}
      className={className}
      actions={CommunityNotesSectionData.actions}
      activeOptionKey={CommunityNotesSectionData.defaultOptionKey}
      description={CommunityNotesSectionData.info.description}
      title={CommunityNotesSectionData.info.title}
      features={CommunityNotesSectionData.info.features}
      tabsAsLinks
      animated={false}
      circleImage={CIRCLE_IMAGE_PATH}
    />
  );
};
