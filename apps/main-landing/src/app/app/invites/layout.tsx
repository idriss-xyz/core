'use client';
import InviteBanner from './banner';

// ts-unused-exports:disable-next-line
export default function InvitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-4">
        <h1 className="text-heading3">Invites</h1>
        <InviteBanner />
      </div>
      {children}
    </div>
  );
}
