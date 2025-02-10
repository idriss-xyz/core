'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { isAddress } from 'viem';
import { useState } from 'react';

import { TopBar } from '@/components';
import { Providers } from '@/app/creators/providers';
import { TipHistoryResponse } from '@/app/creators/tip-history/types';
import { TipHistoryProviders } from '@/app/creators/tip-history/providers';

import TipHistoryList from './components/tip-history-list';
import { TipHistoryQuery } from './constants';

// ts-unused-exports:disable-next-line
export default function TipHistory() {
  return (
    <Providers>
      <TipHistoryProviders>
        <TipHistoryContent />
      </TipHistoryProviders>
    </Providers>
  );
}

function TipHistoryContent() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const address = searchParameters.get('address');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCursors, setPageCursors] = useState(['']);

  const { data: tipHistory } = useQuery<TipHistoryResponse>(TipHistoryQuery, {
    variables: {
      slug: 'idriss',
      after: pageCursors[pageNumber],
    },
  });

  if ((!address || !isAddress(address)) && address !== 'all') {
    router.push('/creators');
    return;
  }

  const setPage = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const addPageCursor = (pageCursor: string) => {
    if (pageCursors.includes(pageCursor)) {
      return;
    }

    setPageCursors([...pageCursors, pageCursor]);
  };

  return (
    <>
      <TopBar />
      <TipHistoryList
        address={address}
        tips={tipHistory}
        setPage={setPage}
        pageNumber={pageNumber}
        addPageCursor={addPageCursor}
      />
    </>
  );
}
