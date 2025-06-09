import {NavigationMenu} from "@idriss-xyz/ui/navigation-menu";
import {Icon} from "@idriss-xyz/ui/icon";

export function NavigationTabs() {
  return (
    <>
      <div className="flex-row inline-flex rounded-full bg-white">
        <NavigationMenu.Root>
          <NavigationMenu.List className="flex p-1 gap-1.5">
            <NavigationMenu.Item className="flex items-center py-2 px-4 gap-1.5 justify-center rounded-full bg-white hover:bg-gradient-to-b from-white to-[#5FEB3C] border border-white hover:border-[#5FEB3C]">

              <NavigationMenu.Trigger asChild className="">
                <Icon name="LineChart" size={15} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-label4">Stats</span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex items-center py-2 px-4 gap-1.5 justify-center rounded-full bg-white hover:bg-gradient-to-b from-white to-[#5FEB3C] border border-white hover:border-[#5FEB3C]">
              <NavigationMenu.Trigger asChild className="">
                <Icon name="History" size={15} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-label4">History</span>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex items-center py-2 px-4 gap-1.5 justify-center rounded-full bg-white hover:bg-gradient-to-b from-white to-[#5FEB3C] border border-white hover:border-[#5FEB3C]">
              <NavigationMenu.Trigger asChild className="">
                <Icon name="Trophy" size={15} className="text-black" />
              </NavigationMenu.Trigger>
              <span className="text-label4">Top Donors</span>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </>
  )
}
