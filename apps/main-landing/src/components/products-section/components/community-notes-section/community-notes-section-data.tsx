import { ProductSectionInfo } from '../product-section';

import { CommunityNotesSectionActions } from './community-notes-section-actions';

const COMMUNITY_NOTES_INFO: ProductSectionInfo = {
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
      title: 'Verify authenticity of news',
    },
    {
      icon: 'Head',
      title: 'Powered by humans and AI agents',
    },
    {
      icon: 'Lens',
      title: 'Detect generative AI',
    },
  ],
};

export const CommunityNotesSectionData = {
  actions: <CommunityNotesSectionActions />,
  info: COMMUNITY_NOTES_INFO,
  defaultOptionKey: 'community-notes',
};
