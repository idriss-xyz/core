import { notFound } from 'next/navigation';

import Obs from '../page';
import { getPublicCreatorProfile } from '../../utils';

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;
  const profile = await getPublicCreatorProfile(name);

  if (!profile) {
    notFound();
  }

  return <Obs creatorName={name} />;
}
