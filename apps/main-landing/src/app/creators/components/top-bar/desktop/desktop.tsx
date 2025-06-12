import { Button } from '@idriss-xyz/ui/button';
import { useCallback } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/app/creators/context/auth-context';

import { Socials } from './socials';
import { Menu } from './menu';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Desktop = ({ hideNavigation, displayCTA }: Properties) => {
  const router = useRouter();
  const { user } = useDynamicContext();
  const { setIsModalOpen } = useAuth();

  const handleStartEarningClick = useCallback(() => {
    // If user is logged in, redirect to app
    if (user) {
      router.push('/creators/app');
    } else {
      setIsModalOpen(true);
    }
  }, [user, router, setIsModalOpen]);

  return (
    <>
      {!hideNavigation && <Menu className="hidden sm:flex" />}

      {displayCTA ? (
        <div className="hidden items-center gap-x-9 sm:flex">
          <Socials />

          <Button
            size="medium"
            intent="primary"
            onClick={handleStartEarningClick}
            aria-label="Start earning"
            suffixIconName="IdrissArrowRight"
          >
            Start earning
          </Button>
        </div>
      ) : (
        <Socials className="hidden sm:flex" />
      )}
    </>
  );
};
