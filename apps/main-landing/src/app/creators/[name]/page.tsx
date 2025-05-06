import { CreatorProfileForm } from './form';

export default async function CreatorProfile({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // You can use async/await here for server-side data fetching
  const { name } = await params;

  // Pass the name to the client component
  return <CreatorProfileForm initialName={name} />;
}
