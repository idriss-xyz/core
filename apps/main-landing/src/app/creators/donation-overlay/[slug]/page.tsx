import { notFound } from 'next/navigation';

import DonationOverlay from '../donation-overlay';
import { getPublicCreatorProfileBySlug } from '../../utils';

// ts-unused-exports:disable-next-line
export default async function DonationOverlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicCreatorProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return <DonationOverlay creatorName={profile.name} />;
}
