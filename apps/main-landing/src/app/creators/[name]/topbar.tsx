'use client';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { useLogout } from '../hooks/use-logout';
import { useAuth } from '../context/auth-context';
import { setCreatorIfSessionPresent } from '../utils';

export function TopBar() {
  const { creator, setCreator } = useAuth();
  const { user } = usePrivy();
  const handleLogout = useLogout();

  useEffect(() => {
    if (user) {
      void setCreatorIfSessionPresent(user, setCreator);
    }
  }, [user, setCreator]);
  return (
    <>
      <NavigationMenu.Root className="fixed right-0 top-0 z-10 flex justify-end gap-3">
        <NavigationMenu.List className="flex items-center gap-2 p-3">
          <NavigationMenu.Item className="relative flex gap-1">
            <NavigationMenu.Trigger asChild>
              <div className="flex max-h-[70px] min-h-[32px] w-max cursor-pointer items-center gap-2.5">
                <div className="size-[32px] max-h-[48px] min-h-[32px] min-w-[32px] max-w-[48px] rounded-[999px] border border-neutral-300">
                  {creator?.profilePictureUrl ? (
                    <Image
                      src={creator.profilePictureUrl}
                      alt={creator?.name ?? 'avatar'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-full bg-white">
                      <Icon
                        name="UserRound"
                        className="text-gray-300"
                        size={20}
                      />
                    </div>
                  )}
                </div>
                <span className="text-label4 text-neutralGreen-900">
                  {creator?.name}
                </span>
              </div>
            </NavigationMenu.Trigger>

            <NavigationMenu.Content className="absolute right-[-13px] top-full z-50 mr-3 w-max gap-1 py-2">
              <div className="flex min-w-[240px] max-w-[270px] flex-col gap-1 rounded-xl border border-neutral-300 bg-white pt-2 shadow-lg">
                <div className="flex min-h-[32px] items-center rounded-[4px] px-3 py-1">
                  <Link
                    href="/creators/app/profile"
                    className="group flex w-full items-center gap-3"
                  >
                    <Icon
                      name="User"
                      size={20}
                      className="text-neutral-600 group-hover:text-mint-600"
                    />
                    <span className="max-h-[54px] min-h-[24px] min-w-[184px] max-w-[214px] text-body4 text-neutral-900 group-hover:text-mint-600">
                      Profile
                    </span>
                  </Link>
                </div>

                <div className="h-px min-w-[240px] max-w-[270px] py-1">
                  <hr className="border-t border-t-[#E4E7EC]" />
                </div>

                <div className="flex flex-col gap-2 pb-2">
                  <div
                    onClick={handleLogout}
                    className="group flex min-h-[32px] cursor-pointer items-center gap-3 rounded-[4px] px-3 py-1"
                  >
                    <Icon
                      name="LogOut"
                      size={20}
                      className="text-neutral-600 group-hover:text-mint-600"
                    />
                    <span className="max-h-[54px] min-h-[24px] min-w-[184px] max-w-[214px] text-body4 text-neutral-900 group-hover:text-mint-600">
                      Log out
                    </span>
                  </div>
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </>
  );
}
