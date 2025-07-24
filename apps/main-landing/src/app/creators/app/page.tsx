'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';
import Setup from './setup/page';

// ts-unused-exports:disable-next-line
export default function Home() {
  const { creator } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (creator) {
      console.log('creator is set up:', creator.doneSetup);
      if (creator.doneSetup) {
        router.replace('/creators/app/earnings/stats');
      } else {
        router.replace('/creators/app/setup/payment-methods');
      }
    }
  }, [creator, router]);

  return <Setup/>;
}
