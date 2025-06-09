import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import { Socials } from '@/app/creators/earnings/socials';

export function RightTopMenu() {
  return (
    <>
      <NavigationMenu.Root className="flex justify-center py-2">
        <NavigationMenu.List className="flex w-[1174px] justify-end">
          <div className="flex h-[56px] w-[266.5px] items-center justify-center gap-2">
            <NavigationMenu.Item>
              <div className="h-[48] w-[48] rounded-full border bg-white hover:border-mint-400">
                <IconButton
                  size="medium"
                  intent="tertiary"
                  iconName="BellNotification"
                  iconClassName="size-5"
                />
              </div>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="relative">
              <NavigationMenu.Trigger asChild>
                <div className="rounded-full border bg-white hover:border-mint-400">
                  <IconButton
                    size="medium"
                    iconName="Grip"
                    iconClassName="size-5"
                  />
                </div>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-[-120px] w-[240px] gap-1 py-4">
                <div className="flex flex-col gap-1 rounded-[12px] border border-[#DBDDE2] bg-white pt-2 [box-shadow:0px_32px_64px_0px_#00000026,_0px_1px_3px_0px_#0000001A]">
                  <div className="flex gap-1.5 px-3 py-1">
                    <Icon
                      name="Settings"
                      size={25}
                      className="text-[#717484]"
                    />
                    <span className="text-body4">Setup up guide</span>
                  </div>

                  <div className="flex gap-1.5 px-3 py-1">
                    <Icon
                      name="HelpCircle"
                      size={25}
                      className="text-[#717484]"
                    />
                    <span className="text-body4">Support</span>
                  </div>

                  <div className="py-1">
                    <hr className="border-t border-t-[#E4E7EC]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1.5 px-3 py-1">
                      <Icon
                        name="LogOut"
                        size={25}
                        className="text-[#717484]"
                      />
                      <span className="text-body4">Log out</span>
                    </div>

                    <div>
                      <Socials className="justify-center rounded-b-[12px] border-t border-t-[#E7FED8] bg-[#FAFFF5] py-0.5" />
                    </div>
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <div className="h-[46px] w-[46px] rounded-full bg-white">
                <img src="https://ipfs.io/ipfs/bafkreigwt4fn24gyh4nnqjutxio24dqfloyolo4h4nljkhran6dypy7e5q" />
              </div>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="flex items-center justify-center">
              <div className="text-label3">geoist.eth</div>
            </NavigationMenu.Item>
          </div>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </>
  );
}
