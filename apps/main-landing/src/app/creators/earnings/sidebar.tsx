import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';

export function Sidebar() {
  return (
    <div className="p-2">
      <NavigationMenu.Root
        orientation="vertical"
        className="flex h-[1248px] w-[250px] flex-col gap-12 rounded-lg bg-white px-2 py-8"
      >
        <div className="flex justify-center">
          <img src="/idriss-dark-logo.svg" height={24} width={98} alt="" />
        </div>

          <NavigationMenu.List className="flex flex-col gap-4">
            <NavigationMenu.Item className="flex h-[52px] items-center gap-2 rounded-full border border-transparent px-4 py-3 hover:border-neutral-300 hover:bg-neutral-100">
              <NavigationMenu.Trigger asChild>
                <Icon name="LayoutDashboard" size={20} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-button1 uppercase">Setup</span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex h-[52px] items-center gap-2 rounded-full border border-transparent px-4 py-3 hover:border-neutral-300 hover:bg-neutral-100">
              <NavigationMenu.Trigger asChild>
                <Icon name="BadgeDollarSign" size={20} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-button1 uppercase">Earnings</span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex h-[52px] items-center gap-2 rounded-full border border-transparent px-4 py-3 hover:border-neutral-300 hover:bg-neutral-100">
              <NavigationMenu.Trigger asChild>
                <Icon name="User" size={20} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-button1 uppercase">Profile</span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex h-[52px] items-center gap-2 rounded-full border border-transparent px-4 py-3 hover:border-neutral-300 hover:bg-neutral-100">
              <NavigationMenu.Trigger asChild>
                <Icon name="Trophy" size={20} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-button1 uppercase">Rankings</span>
            </NavigationMenu.Item>
          </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
