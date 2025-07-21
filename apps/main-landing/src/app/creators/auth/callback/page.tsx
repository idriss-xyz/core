'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// This component handles the final step of the custom auth flow.
// ts-unused-exports:disable-next-line
export default function CustomAuthCallbackPage() {
  const router = useRouter();
  const searchParameters = useSearchParams();

  useEffect(() => {
    const customToken = searchParameters.get('token');
    const name = searchParameters.get('name');
    const displayName = searchParameters.get('displayName');
    const pfp = searchParameters.get('pfp');
    const email = searchParameters.get('email');

    if (customToken) {
      // Store Twitch info in sessionStorage to be picked up by the next page.
      if (name) {
        sessionStorage.setItem(
          'twitch_new_user_info',
          JSON.stringify({ name, displayName, pfp, email }),
        );
      }
      // Store the custom token where our PrivyProvider can find it.
      sessionStorage.setItem('custom-auth-token', customToken);
      // Redirect to the main app. The PrivyProvider will now automatically
      // use the token to authenticate the user.
      router.push('/creators/app');
    } else {
      // No token found, redirect away
      router.push('/creators');
    }
  }, [searchParameters, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <p>Please wait, completing login...</p>
    </div>
  );
}
