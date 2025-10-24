import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { CREATOR_SETUP_GUIDE_LINK, SUPPORT_LINK } from '@idriss-xyz/constants';

import { socialOptions } from '../constants';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!path) return false;
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    return `flex max-h-[82px] min-h-[52px] items-center gap-2 rounded-full px-4 py-2 text-button1 uppercase ${
      isActive(path)
        ? 'border border-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-900'
        : 'text-neutralGreen-900'
    }`;
  };

  return (
    <div className="p-3 pr-0">
      <NavigationMenu.Root
        orientation="vertical"
        className="flex h-full w-[234px] flex-col justify-between rounded-2xl bg-white px-2 pb-2 pt-8"
      >
        <div className="flex flex-col gap-12">
          <div className="flex justify-center">
            <Link href="/">
              <img src="/idriss-creators-dark-logo.svg" height={50} alt="" />
            </Link>
          </div>

          {/*TODO: Extract this to a component*/}
          <NavigationMenu.List className="flex flex-col gap-4">
            <NavigationMenu.Item className={getLinkClasses('/app/setup')}>
              <Link
                href="/app/setup/payment-methods"
                className="flex w-full items-center rounded-lg hover:text-mint-600"
              >
                <Icon
                  size={20}
                  name="LayoutDashboard"
                  className="mr-3 size-5"
                />
                Setup
              </Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item className={getLinkClasses('/app/earnings')}>
              <Link
                href="/app/earnings/stats-and-history"
                className="flex w-full items-center rounded-lg hover:text-mint-600"
              >
                <Icon
                  size={20}
                  name="BadgeDollarSign"
                  className="mr-3 size-5"
                />
                Earnings
              </Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item className={getLinkClasses('/app/ranking')}>
              <Link
                href="/app/ranking/top-creators"
                className="flex w-full items-center rounded-lg hover:text-mint-600"
              >
                <Icon size={20} name="Trophy" className="mr-3 size-5" />
                Ranking
              </Link>
            </NavigationMenu.Item>
            {/* Uncomment when Rewards gets implemented*/}
            {/* <NavigationMenu.Item className={getLinkClasses('')}>
              <Link
                href="" // TODO: Add link
                className="flex w-full items-center rounded-lg hover:text-mint-600"
              >
                <Icon size={20} name="Gift" className="mr-3 size-5" />
                Rewards
              </Link>
            </NavigationMenu.Item> */}
          </NavigationMenu.List>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-3.5">
            <div className="flex max-h-[62px] min-h-[32px] flex-col rounded-[4px] px-3 py-1">
              <Link
                href={CREATOR_SETUP_GUIDE_LINK}
                className="group flex items-center gap-3"
              >
                <Icon
                  name="BookOpen"
                  size={20}
                  className="text-neutral-600 group-hover:text-mint-600"
                />
                <span className="text-body4 text-neutral-900 group-hover:text-mint-600">
                  Setup guide
                </span>
              </Link>
            </div>

            <div className="flex max-h-[62px] min-h-[32px] flex-col rounded-[4px] px-3 py-1">
              <Link
                href={SUPPORT_LINK}
                className="group flex items-center gap-3"
              >
                <Icon
                  name="HelpCircle"
                  size={20}
                  className="text-neutral-600 group-hover:text-mint-600"
                />
                <span className="text-body4 text-neutral-900 group-hover:text-mint-600">
                  Support
                </span>
              </Link>
            </div>
          </div>

          <div className="flex h-[48px] justify-between gap-3">
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
      </NavigationMenu.Root>
    </div>
  );
}
