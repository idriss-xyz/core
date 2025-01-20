'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// ts-unused-exports:disable-next-line
export default function DevelopmentLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkPassword = () => {
      const password = prompt('Enter the password to access this page:');

      if (password === process.env.DEV_LOGIN_PASSWORD) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        Cookies.set('password', password, { path: '/' });

        const redirectTo =
          new URLSearchParams(window.location.search).get('redirect') ?? '/';
        router.push(redirectTo);
      } else {
        alert('Incorrect password.');
        window.location.href = '/';
      }
    };

    checkPassword();
  }, [router]);

  return <div>Redirecting...</div>;
}
