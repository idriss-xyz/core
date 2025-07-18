import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Icon } from '@idriss-xyz/ui/icon';
import { DonationData } from '@idriss-xyz/constants';

import { DonateHistoryItem } from '@/app/creators/donate/components/donate-history/donate-history-item';

// TODO: Replace this with actual data
const donationData1: DonationData = {
  toAddress: '0x7d716741d2c37925e5e15123025400be80ec796d',
  network: 'BASE_MAINNET',
  comment: ' Who is this legend?',
  fromAddress: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
  timestamp: 1_749_156_845_000,
  amountRaw: '2327300895212334000000',
  tokenAddress: '0x000096630066820566162c94874a776532705231',
  tradeValue: 9.883_347_318_451_692,
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
    displayName: 'vitalik.eth',
    avatarUrl:
      'https://res.cloudinary.com/base-web/image/fetch/w_64/f_webp/https%3A%2F%2Fbase.mypinata.cloud%2Fipfs%2Fbafkreicr5lh2f3eumcn4meif5t2pauzeddjjbhjbl4enqrp4ooz4e7on6i%3FpinataGatewayToken%3Df6uqhE35YREDMuFqLvxFLqd-MBRlrJ1qWog8gyCF8T88-Tsiu2IX48F-kyVti78J',
  },
};

// TODO: Replace this with actual data
const donationData2: DonationData = {
  toAddress: '0x7d716741d2c37925e5e15123025400be80ec796d',
  network: 'BASE_MAINNET',
  comment: ' Who is this legend?',
  fromAddress: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
  timestamp: 1_749_156_845_000,
  amountRaw: '2327300895212334000000',
  tokenAddress: '0x000096630066820566162c94874a776532705231',
  tradeValue: 9.883_347_318_451_692,
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
    displayName: 'vitalik.eth',
    avatarUrl: 'https://euc.li/dafaqtor.eth',
  },
  transactionHash:
    '0xf184d8e44c5e5e6e0fef2e781b36791ac840110393605dd3702a54c7dc23d378',
  fromUser: {
    address: '0x5abca791c22e7f99237fcc04639e094ffa0ccce9',
    displayName: 'idriss',
    avatarUrl:
      'https://res.cloudinary.com/base-web/image/fetch/w_64/f_webp/https%3A%2F%2Fbase.mypinata.cloud%2Fipfs%2Fbafkreicr5lh2f3eumcn4meif5t2pauzeddjjbhjbl4enqrp4ooz4e7on6i%3FpinataGatewayToken%3Df6uqhE35YREDMuFqLvxFLqd-MBRlrJ1qWog8gyCF8T88-Tsiu2IX48F-kyVti78J',
  },
};

export function TopBar() {
  return (
    <>
      <NavigationMenu.Root className="flex justify-end gap-3">
        <NavigationMenu.List className="flex items-center gap-3 p-3">
          <NavigationMenu.Item className="relative">
            <NavigationMenu.Trigger asChild>
              <div className="flex max-h-[70px] min-h-[40px] min-w-[40px] max-w-[70px] items-center justify-center rounded-full border border-neutral-300 bg-white">
                <Icon name="BellNotification" size={20} />
              </div>
            </NavigationMenu.Trigger>

            <NavigationMenu.Content className="absolute right-[-136px] top-full mr-3 mt-3 w-max">
              {/*TODO: work on positioning*/}
              <div className="flex flex-col gap-1 rounded-xl border border-neutral-300 bg-white p-3 shadow-lg">
                <div className="min-w-[400px] max-w-[430px] gap-2 rounded-xl pb-3">
                  <DonateHistoryItem
                    donation={donationData1}
                    key={donationData1.transactionHash}
                    showMenu={false}
                  />
                </div>

                <div className="gap-2.5">
                  <hr className="min-w-[400px] max-w-[430px] bg-[#DBDDE2]" />
                </div>

                <div className="min-w-[400px] max-w-[430px] gap-2 rounded-xl pt-3">
                  <DonateHistoryItem
                    donation={donationData2}
                    key={donationData2.transactionHash}
                    showMenu={false}
                  />
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="relative flex gap-1">
            <NavigationMenu.Trigger asChild>
              <div className="flex max-h-[70px] min-h-[40px] w-max items-center gap-2.5">
                <div className="size-[48px] max-h-[48px] min-h-[48px] min-w-[48px] max-w-[48px] rounded-[999px] border border-[#AAAFB9]">
                  <img
                    src="https://res.cloudinary.com/base-web/image/fetch/w_64/f_webp/https%3A%2F%2Fbase.mypinata.cloud%2Fipfs%2Fbafkreicr5lh2f3eumcn4meif5t2pauzeddjjbhjbl4enqrp4ooz4e7on6i%3FpinataGatewayToken%3Df6uqhE35YREDMuFqLvxFLqd-MBRlrJ1qWog8gyCF8T88-Tsiu2IX48F-kyVti78J"
                    alt="avatar"
                  />
                </div>
                <span className="text-label4 text-neutralGreen-900">
                  geoist_
                </span>
              </div>
            </NavigationMenu.Trigger>

            <NavigationMenu.Content className="absolute right-[-13px] top-full mr-3 w-max gap-1 py-2">
              <div className="flex min-w-[240px] max-w-[270px] flex-col gap-1 rounded-xl border border-neutral-300 bg-white pt-2 shadow-lg">
                <div className="flex min-h-[32px] items-center gap-3 rounded-[4px] px-3 py-1">
                  <div className="flex gap-3 text-[#717484]">
                    <Icon name="User" size={20} />
                    <span className="max-h-[54px] min-h-[24px] min-w-[184px] max-w-[214px] text-body4 text-neutral-900">
                      Profile
                    </span>
                  </div>
                </div>

                <div className="h-px min-w-[240px] max-w-[270px] py-1">
                  <hr className="border-t border-t-[#E4E7EC]" />
                </div>

                <div className="flex flex-col gap-2 pb-2">
                  <div className="flex min-h-[32px] items-center gap-3 rounded-[4px] px-3 py-1">
                    <div className="flex gap-3 text-[#717484]">
                      <Icon name="LogOut" size={20} />
                      <span className="max-h-[54px] min-h-[24px] min-w-[184px] max-w-[214px] text-body4 text-neutral-900">
                        Log out
                      </span>
                    </div>
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
