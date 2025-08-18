import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { DonateHistoryItem } from '@/app/creators/donate/components/donate-history/donate-history-item';

import { useLogout } from '../hooks/use-logout';
import { useAuth } from '../context/auth-context';

export function TopBar() {
  const { donations, newDonationsCount, markDonationsAsSeen, creator } =
    useAuth();
  const handleLogout = useLogout();
  return (
    <>
      <NavigationMenu.Root className="flex justify-end gap-3">
        <NavigationMenu.List className="flex items-center gap-2 p-3">
          <NavigationMenu.Item className="relative">
            <NavigationMenu.Trigger asChild>
              <div
                onClick={markDonationsAsSeen}
                className="relative flex size-8 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white"
              >
                <Icon className="text-gray-300" name="Bell" size={20} />
                {newDonationsCount > 0 && (
                  <div className="absolute right-[-6px] top-[-6px] flex size-4.5 items-center justify-center rounded-full border-2 border-white bg-[#05AB13] text-body6 text-white">
                    {newDonationsCount}
                  </div>
                )}
              </div>
            </NavigationMenu.Trigger>

            <NavigationMenu.Content className="absolute right-[-136px] top-full z-50 mr-3 mt-3 w-max">
              <div className="flex flex-col gap-1 rounded-xl border border-neutral-300 bg-white p-3 shadow-lg">
                {donations.length > 0 ? (
                  donations.slice(0, 5).map((donation, index) => {
                    return (
                      <Fragment key={donation.transactionHash}>
                        <div className="min-w-[400px] max-w-[430px] gap-2 rounded-xl py-3">
                          <DonateHistoryItem
                            donation={donation}
                            showMenu={false}
                          />
                        </div>
                        {index < donations.slice(0, 5).length - 1 && (
                          <div className="gap-2.5">
                            <hr className="min-w-[400px] max-w-[430px] bg-neutral-300" />
                          </div>
                        )}
                      </Fragment>
                    );
                  })
                ) : (
                  <div className="min-w-[400px] max-w-[430px] gap-2 rounded-xl p-3 text-center text-neutral-500">
                    No new notifications
                  </div>
                )}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

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
