'use client';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import Image from 'next/image';
import { useCallback } from 'react';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useRouter } from 'next/navigation';

import { useLogout } from '../hooks/use-logout';
import { useAuth } from '../context/auth-context';
import { socialOptions } from '../constants';

export function DonatePageAvatarMenu() {
  const { donor } = useAuth();
  const handleLogout = useLogout();
  const router = useRouter();

  const handleNavigateToDonorStats = useCallback(() => {
    router.push(`/creators/donor/${donor?.name.toLowerCase()}`);
  }, [router, donor]);

  return (
    <NavigationMenu.Root className="flex">
      <NavigationMenu.List className="flex items-center gap-2 p-3">
        <NavigationMenu.Item className="relative flex gap-1">
          <NavigationMenu.Trigger asChild>
            <div className="flex max-h-[70px] min-h-[32px] w-max cursor-pointer items-center gap-2.5">
              <div className="size-[32px] max-h-[48px] min-h-[32px] min-w-[32px] max-w-[48px] rounded-[999px] border border-neutral-300">
                {donor?.profilePictureUrl ? (
                  <Image
                    src={donor.profilePictureUrl}
                    alt={donor?.name ?? 'avatar'}
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
              <span className="hidden text-label4 text-neutralGreen-900 sm:flex">
                {donor?.name}
              </span>
            </div>
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute right-[-13px] top-full z-50 mr-3 w-max gap-1 py-2">
            <div className="flex min-w-[240px] max-w-[270px] flex-col gap-1 rounded-xl border border-neutral-300 bg-white pt-2 shadow-lg">
              <div className="flex flex-col gap-2 pb-2">
                <span className="flex px-3 py-1 text-label4 text-neutralGreen-900 sm:hidden">
                  Welcome, {donor?.name}
                </span>
                <hr className="sm:hidden" />
                <div
                  onClick={handleNavigateToDonorStats}
                  className="group flex min-h-[32px] cursor-pointer items-center gap-3 rounded-[4px] px-3 py-1"
                >
                  <Icon
                    name="LineChart"
                    size={20}
                    className="text-neutral-600 group-hover:text-mint-600"
                  />
                  <span className="max-h-[54px] min-h-[24px] min-w-[184px] max-w-[214px] text-body4 text-neutral-900 group-hover:text-mint-600">
                    Stats & history
                  </span>
                </div>
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
              <hr />
              <div className="flex gap-2">
                {socialOptions.map((social, index) => {
                  return (
                    <IconButton
                      href={social.link}
                      className="w-full"
                      isExternal
                      asLink
                      intent="tertiary"
                      iconName={social.iconName}
                      size="extra"
                      key={index}
                    />
                  );
                })}
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
