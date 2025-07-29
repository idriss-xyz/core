import { notFound } from 'next/navigation';

import Obs from '../page';
import { getPublicCreatorProfileBySlug } from '../../utils';

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicCreatorProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return <Obs creatorName={profile.name} />;
}
