// src/hooks/use-redirect-not-authenticated.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export default function useRedirectIfNotAuthenticated() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (!ready) return; // wait for Privy to init
    if (!authenticated) {
      // only bounce truly unauth’d
      router.replace('/creators?login=true');
    }
  }, [ready, authenticated, router]);
}
