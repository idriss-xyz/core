import { notFound } from 'next/navigation';

import GoalOverlay from '../goal-overlay';
import { getPublicCreatorProfileBySlug } from '../../utils';

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

  return <GoalOverlay creatorName={profile.name} />;
}
