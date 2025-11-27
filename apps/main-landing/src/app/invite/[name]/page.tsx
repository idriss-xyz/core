import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPublicCreatorProfile } from '@/app/utils';

import LandingContent from './landing-content';

type Properties = {
  params: Promise<{ name: string }>;
};

// ts-unused-exports:disable-next-line
export async function generateMetadata({
  params,
}: Properties): Promise<Metadata> {
  const { name } = await params;
  const profile = await getPublicCreatorProfile(name);
  if (!profile) {
    return { robots: { index: false, follow: false } };
  }

  const ogUrl = `/api/og?name=${encodeURIComponent(profile.name)}&avatar=${encodeURIComponent(profile.profilePictureUrl ?? '')}`;

  return {
    openGraph: {
      images: [{ url: ogUrl }],
    },
  };
}

// ts-unused-exports:disable-next-line
export default async function InvitePage({ params }: Properties) {
  const { name } = await params;
  const creator = await getPublicCreatorProfile(name);
  if (!creator || creator.isDonor) notFound();

  return <LandingContent creator={creator} />;
}
