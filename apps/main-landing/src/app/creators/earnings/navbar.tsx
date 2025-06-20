import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import { DonateContentValues, DonationData } from '@/app/creators/donate/types';
import { DonateHistory } from '@/app/creators/donate/components/donate-history';
import { useCreators } from '@/app/creators/hooks/use-creators';
import { DonateHistoryItem } from '@/app/creators/donate/components/donate-history/donate-history-item';

export function Navbar() {
  const { urlParams } = useCreators();

  const donationData1: DonationData = {
    toAddress: '0x7d716741d2c37925e5e15123025400be80ec796d',
    network: 'BASE_MAINNET',
    comment: ' Who is this legend?',
    fromAddress: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
    timestamp: 1749156845000,
    amountRaw: '2327300895212334000000',
    tokenAddress: '0x000096630066820566162c94874a776532705231',
    tradeValue: 9.883347318451692,
    token: {
      address: '0x000096630066820566162c94874a776532705231',
      symbol: 'IDRISS',
      imageUrl:
        'https://storage.googleapis.com/zapper-fi-assets/tokens/base/0x000096630066820566162c94874a776532705231.png',
      network: 'BASE_MAINNET',
      decimals: 18,
    },
    toUser: {
      address: '0x7d716741d2c37925e5e15123025400be80ec796d',
      displayName: 'dafaqtor.eth',
      avatarUrl: 'https://euc.li/dafaqtor.eth',
    },
    transactionHash:
      '0xf184d8e44c5e5e6e0fef2e781b36791ac840110393605dd3702a54c7dc23d378',
    fromUser: {
      address: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
      displayName: 'idriss.base.eth',
      avatarUrl:
        'https://ipfs.io/ipfs/bafkreigwt4fn24gyh4nnqjutxio24dqfloyolo4h4nljkhran6dypy7e5q',
    },
  };

  const donationData2: DonationData = {
    toAddress: '0x7d716741d2c37925e5e15123025400be80ec796d',
    network: 'BASE_MAINNET',
    comment: ' Who is this legend?',
    fromAddress: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
    timestamp: 1749156845000,
    amountRaw: '2327300895212334000000',
    tokenAddress: '0x000096630066820566162c94874a776532705231',
    tradeValue: 9.883347318451692,
    token: {
      address: '0x000096630066820566162c94874a776532705231',
      symbol: 'IDRISS',
      imageUrl:
        'https://storage.googleapis.com/zapper-fi-assets/tokens/base/0x000096630066820566162c94874a776532705231.png',
      network: 'BASE_MAINNET',
      decimals: 18,
    },
    toUser: {
      address: '0x7d716741d2c37925e5e15123025400be80ec796d',
      displayName: 'dafaqtor.eth',
      avatarUrl: 'https://euc.li/dafaqtor.eth',
    },
    transactionHash:
      '0xf184d8e44c5e5e6e0fef2e781b36791ac840110393605dd3702a54c7dc23d378',
    fromUser: {
      address: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
      displayName: 'idriss',
      avatarUrl:
        'https://ipfs.io/ipfs/bafkreigwt4fn24gyh4nnqjutxio24dqfloyolo4h4nljkhran6dypy7e5q',
    },
  };

  return (
    <>
      <NavigationMenu.Root className="flex justify-end gap-3">
        <NavigationMenu.List className="flex gap-3 p-3 items-center">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger asChild>
              <div className="flex max-h-[70px] min-h-[40px] min-w-[40px] max-w-[70px] items-center justify-center rounded-full border border-neutral-300 bg-white">
                <Icon name="BellNotification" size={20} />
              </div>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="flex gap-2">
            <NavigationMenu.Trigger asChild>
              <div className="flex min-h-[40px] max-h-[70px] gap-2.5 items-center">
                <div className="max-h-[48px] min-h-[48px] min-w-[48px] max-w-[48px] w-[48px] h-[48px] rounded-[999px] border border-[#AAAFB9]">
                  <img src="https://ipfs.io/ipfs/bafkreigwt4fn24gyh4nnqjutxio24dqfloyolo4h4nljkhran6dypy7e5q" />
                </div>
                <span className="text-label4 text-[#000A05]">geoist_</span>
              </div>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>

          {/*      <NavigationMenu.Content>*/}
          {/*        /!*TODO: work on positioning*!/*/}
          {/*        <div className="max-w-[434px] flex flex-col gap-2 rounded-[12px] border border-neutral-300 bg-white p-4 shadow-lg absolute right-3 top-16">*/}
          {/*          /!*TODO: adjust shadows?*!/*/}
          {/*          <div className="min-w-[400px] max-w-[430px] gap-2 rounded-[12px] p-4 3xl:shadow-sm">*/}
          {/*            <DonateHistoryItem*/}
          {/*              donation={donationData1}*/}
          {/*              key={donationData1.transactionHash}*/}
          {/*              showMenu={false}*/}
          {/*            />*/}
          {/*          </div>*/}

          {/*          <div className="gap-2.5">*/}
          {/*            <hr className="min-w-[400px] max-w-[430px] bg-[#DBDDE2]" />*/}
          {/*          </div>*/}

          {/*          <div className="min-w-[400px] max-w-[430px] gap-2 rounded-[12px] p-4">*/}
          {/*            <DonateHistoryItem*/}
          {/*              donation={donationData2}*/}
          {/*              key={donationData2.transactionHash}*/}
          {/*              showMenu={false}*/}
          {/*            />*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </NavigationMenu.Content>*/}
          {/*    </NavigationMenu.Item>*/}

          {/*      <NavigationMenu.Content className="absolute left-[-120px] w-[240px] gap-1 py-4">*/}
          {/*        <div className="flex flex-col gap-1 rounded-[12px] border border-[#DBDDE2] bg-white pt-2 [box-shadow:0px_32px_64px_0px_#00000026,_0px_1px_3px_0px_#0000001A]">*/}
          {/*          <div className="flex items-center gap-3 px-3 py-1">*/}
          {/*            <Icon name="User" size={20} className="text-[#717484]" />*/}
          {/*            <span className="text-body4">Profile</span>*/}
          {/*          </div>*/}

          {/*          <div className="py-1">*/}
          {/*            <hr className="border-t border-t-[#E4E7EC]" />*/}
          {/*          </div>*/}

          {/*          <div className="flex flex-col gap-2 pb-2">*/}
          {/*            <div className="flex items-center gap-3 px-3 py-1">*/}
          {/*              <Icon*/}
          {/*                name="LogOut"*/}
          {/*                size={20}*/}
          {/*                className="text-[#717484]"*/}
          {/*              />*/}
          {/*              <span className="text-body4">Log out</span>*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </NavigationMenu.Content>*/}
          {/*    </NavigationMenu.Item>*/}

          {/*    <NavigationMenu.Item className="flex items-center justify-center">*/}
          {/*      <div className="text-label3">geoist.eth</div>*/}
          {/*    </NavigationMenu.Item>*/}
          {/*  </div>*/}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </>
  );
}
