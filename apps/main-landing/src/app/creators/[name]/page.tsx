import { Providers } from '../providers';
import { DonateForm } from './donate-form';

export default async function CreatorProfile({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // You can use async/await here for server-side data fetching
  const { name } = await params;

  // Pass the name to the client component
  return (
    <Providers>
      <DonateForm initialName={name} />
    </Providers>
  );
}
