import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import Link from 'next/link';

import { socialOptions } from '@/app/creators/earnings/social-options';

export function Sidebar() {
  return (
    <div className="p-3">
      <NavigationMenu.Root
        orientation="vertical"
        className="flex h-full min-w-[250px] max-w-[280px] flex-col justify-between rounded-[16px] bg-white px-2 pb-2 pt-8"
      >
        <div className="flex flex-col gap-12">
          <div className="flex justify-center">
            <Link href="/">
              <img src="/idriss-dark-logo.svg" height={24} width={98} alt="" />
            </Link>
          </div>

          {/*TODO: Reward and Earnings buttons are inconsistent*/}
          <NavigationMenu.List className="flex flex-col gap-4">
            <NavigationMenu.Item className="flex max-h-[82px] min-h-[52px] items-center gap-2 rounded-full px-4 py-2">
              <Icon
                name="LayoutDashboard"
                size={20}
                className="text-neutralGreen-900"
              />
              <span className="text-button1 uppercase text-neutralGreen-900">
                Setup
              </span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 py-3">
              <Icon name="BadgeDollarSign" size={20} className="text-neutralGreen-900" />
              <span className="text-button1 uppercase text-neutralGreen-900">
                Earnings
              </span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex max-h-[82px] min-h-[52px] items-center gap-2 rounded-full px-4 py-2">
              <Icon
                name="User"
                size={20}
                className="text-neutralGreen-900"
              />
              <span className="text-button1 uppercase text-neutralGreen-900">
                Profile
              </span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex max-h-[82px] min-h-[52px] items-center gap-2 rounded-full px-4 py-2">
              <Icon name="Trophy" size={20} className="text-neutralGreen-900" />
              <span className="text-button1 uppercase text-neutralGreen-900">
                Ranking
              </span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex max-h-[82px] min-h-[52px] items-center gap-2 rounded-full px-4 py-2">
              <Icon name="Gift" size={20} className="text-neutralGreen-900" />
              <span className="text-button1 uppercase text-neutralGreen-900">
                Rewards
              </span>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-3.5">
            <div className="flex min-h-[32px] max-h-[62px] flex-col rounded-[4px] px-3 py-1">
              <div className="flex items-center gap-3">
                <Icon name="BookOpen" size={20} className="text-[#717484]" />
                <span className="text-body4 text-neutral-900">
                  Setup guide
                </span>
              </div>
            </div>

            <div className="flex min-h-[32px] max-h-[62px] flex-col rounded-[4px] px-3 py-1">
              <div className="flex items-center gap-3">
                <Icon name="HelpCircle" size={20} className="text-[#717484]" />
                <span className="text-body4 text-neutral-900">
                  Support
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between p-3">
            {socialOptions.map((social, index) => {
              return <Icon name={social.iconName} size={24} key={index} />;
            })}
          </div>
        </div>

      </NavigationMenu.Root>
    </div>
  );
}
