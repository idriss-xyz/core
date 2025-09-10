import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '../context/auth-context';

export const useLogout = () => {
  const { logout } = usePrivy();
  const { setCreator, setIsModalOpen } = useAuth();

  return async () => {
    await logout();

    localStorage.removeItem('twitch_new_user_info');
    localStorage.removeItem('custom-auth-token');

    void Promise.resolve().then(() => {
      setCreator(null);
      setIsModalOpen(false);
    });
  };
};
