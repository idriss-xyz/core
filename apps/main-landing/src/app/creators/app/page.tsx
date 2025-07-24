'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';

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

  return (
    <div
      role="status"
      className="size-full animate-pulse space-y-4 divide-y divide-gray-200 rounded-sm border border-gray-200 p-4 pt-5 shadow-sm md:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-200" />
          <div className="h-2 w-32 rounded-full bg-gray-200" />
        </div>
        <div className="h-2.5 w-12 rounded-full bg-gray-200" />
      </div>
      {Array.from({ length: 15 }).map((_, index) => {
        return (
          <div className="flex items-center justify-between pt-4" key={index}>
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-200" />
              <div className="h-2 w-32 rounded-full bg-gray-200" />
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-200" />
          </div>
        );
      })}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
