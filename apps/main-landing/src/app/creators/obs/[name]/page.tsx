import Obs from '../page';

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return <Obs creatorName={name} />;
}
