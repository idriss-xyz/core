import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

import { useAuth } from '../context/auth-context';

export const useLogout = () => {
  const { logout } = usePrivy();
  const router = useRouter();
  const { setCreator } = useAuth();

  return async () => {
    await logout();
    localStorage.removeItem('twitch_new_user_info');
    localStorage.removeItem('custom-auth-token');
    setCreator(null);
    router.push('/creators');
  };
};
