import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';

export function RightTopMenu() {
  return (
    <>


      <NavigationMenu.Root>
        <NavigationMenu.List className="flex justify-end">
          <div className="flex items-center justify-center gap-3 p-3">
            <NavigationMenu.Item>
              <div className="flex rounded-full border bg-white hover:border-mint-400 w-[40px] h-[40px] items-center justify-center">
                <Icon name="BellNotification" size={20} />
              </div>
            </NavigationMenu.Item>

            <NavigationMenu.Item className="relative">
              <NavigationMenu.Trigger asChild>
                <NavigationMenu.Item>
                  <div className="h-[46px] w-[46px] rounded-full bg-white">
                    <img src="https://ipfs.io/ipfs/bafkreigwt4fn24gyh4nnqjutxio24dqfloyolo4h4nljkhran6dypy7e5q" />
                  </div>
                </NavigationMenu.Item>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-[-120px] w-[240px] gap-1 py-4">
                <div className="flex flex-col gap-1 rounded-[12px] border border-[#DBDDE2] bg-white pt-2 [box-shadow:0px_32px_64px_0px_#00000026,_0px_1px_3px_0px_#0000001A]">

                  <div className="flex px-3 py-1 gap-3 items-center">
                    <Icon
                      name="User"
                      size={20}
                      className="text-[#717484]"
                    />
                    <span className="text-body4">Profile</span>
                  </div>

                  <div className="py-1">
                    <hr className="border-t border-t-[#E4E7EC]" />
                  </div>

                  <div className="flex flex-col gap-2 pb-2">
                    <div className="flex px-3 py-1 gap-3 items-center">
                      <Icon
                        name="LogOut"
                        size={20}
                        className="text-[#717484]"
                      />
                      <span className="text-body4">Log out</span>
                    </div>

                  </div>
                </div>
              </NavigationMenu.Content>
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
