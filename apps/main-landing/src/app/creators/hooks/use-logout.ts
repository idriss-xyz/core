import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

import { useAuth } from '../context/auth-context';

export const useLogout = () => {
  const { logout } = usePrivy();
  const router = useRouter();
  const { setCreator, setDonor, setIsModalOpen, callbackUrl } = useAuth();

  return async () => {
    await logout();

    if (!callbackUrl || callbackUrl?.endsWith('/creators')) {
      router.replace('/creators');
    } else {
      router.replace(callbackUrl);
    }

    localStorage.removeItem('twitch_new_user_info');
    localStorage.removeItem('custom-auth-token');

    void Promise.resolve().then(() => {
      setCreator(null);
      setDonor(null);
      setIsModalOpen(false);
    });
  };
};
