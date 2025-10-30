import { notFound } from 'next/navigation';

import { getPublicCreatorProfileBySlug } from '@/app/utils';

import GoalOverlay from '../goal-overlay';

// ts-unused-exports:disable-next-line
export default async function GoalOverlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicCreatorProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return (
    <GoalOverlay creatorName={profile.name} creatorAddress={profile.address} />
  );
}
