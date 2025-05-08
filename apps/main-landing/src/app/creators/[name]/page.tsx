import { TopBar } from '@/components';
import { Providers } from '../providers';
import { DonateForm } from './donate-form';
import { backgroundLines2 } from '@/assets';

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
      <TopBar />
        <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
          <link rel="preload" as="image" href={backgroundLines2.src} />
          <img
            alt=""
            src={backgroundLines2.src}
            className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
          />
        <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[1fr,auto]">
          <DonateForm initialName={name} className="container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"/>
        </div>
      </main>
    </Providers>
  );
}
