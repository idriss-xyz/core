'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { isAddress } from 'viem';

import { TopBar } from '@/components';
import { Providers } from '@/app/creators/providers';

import TipHistoryList from './components/tip-history-list';

// ts-unused-exports:disable-next-line
export default function TipHistory() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const address = searchParameters.get('address');

  if (!address || !isAddress(address)) {
    router.push('/creators');
    return;
  }

  return (
    <Providers>
      <TopBar />
      <TipHistoryList address={address} />
    </Providers>
  );
}
