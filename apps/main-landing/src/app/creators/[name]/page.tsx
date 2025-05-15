import Donate from '../donate/page';

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return <Donate creatorName={name} />;
}
