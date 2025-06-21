'use client';
/* eslint-disable @next/next/no-img-element */
import '@rainbow-me/rainbowkit/styles.css';
import { Sidebar } from '@/app/creators/earnings/sidebar';
import { NavigationTabs } from '@/app/creators/earnings/navigation-tabs';
import { Icon } from '@idriss-xyz/ui/icon';
import { Navbar } from '@/app/creators/earnings/navbar';
import { RainbowKitProviders } from '@/app/creators/donate/providers';

// ts-unused-exports:disable-next-line
export default function Earnings() {
  return (
    <RainbowKitProviders>
      <EarningsContent />
    </RainbowKitProviders>
  );
}

function EarningsContent() {
  return (
    <div className="bg-lime-400">
      <div className="flex max-h-[1294px] min-h-[1264px] min-w-[1440px] max-w-[1430px] justify-between bg-[#F6F7F8]">
        <Sidebar />
        <div className="flex min-w-[1166px] max-w-[1196] flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex max-h-[1218] min-h-[1188px] flex-col">
              <Navbar />
              {/*TODO: parent component has another hight className="flex flex-col min-h-[1197px] max-h-[1227px]*/}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2.5">
                        <span className="max-h-[48px] min-h-[18px] min-w-[46px] max-w-[76px] text-body6 text-neutral-800">
                          Earnings
                        </span>
                      </div>
                      <div className="h-[16px] max-h-[46px] min-h-[16px] w-[16px] min-w-[16px] max-w-[46px]">
                        {/*TODO: Icon size should be 16 or 20?*/}
                        <Icon
                          name="IdrissArrowRight"
                          size={16}
                          className="text-black"
                        />
                      </div>

                      <div className="flex gap-2.5">
                        <span className="h-[18px] max-h-[48px] min-h-[18px] w-[79px] min-w-[79px] max-w-[109px] text-body6 text-neutral-800">
                          Stats & history
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="flex h-[40px] max-h-[70px] min-h-[40px] w-[213px] min-w-[213px] max-w-[243px] items-center">
                        <span className="flex h-[40px] max-h-[70px] min-h-[40px] w-[126px] min-w-[126px] max-w-[156px] text-heading3 text-[#000A05]">
                          Earnings
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-[1166px] max-w-[1196px] gap-1">
                    <div className="flex gap-1 rounded-full border border-neutral-300 bg-white p-1">
                      <div className="flex items-center justify-center gap-2 rounded-full px-8 py-3">
                        <Icon size={20} name="Wallet" className="text-black" />
                        <span className="max-h-[38px] min-h-[18px] min-w-[59px] max-w-[89px] text-label4 text-black">
                          Balance
                        </span>
                      </div>

                      <div>
                        <div className="relative flex min-h-[44px] max-h-[74px] items-center gap-2 bg-white justify-center rounded-full overflow-hidden border border-[#5FEB3C] px-8 py-2 text-[#000A05]">
                          <Icon name={"LineChart"} size={20}/>
                          <span className="relative z-[1] text-label4 text-black min-w-[108] max-w-[138] min-h-[18px] max-h-[48]">
                            Stats & history
                          </span>
                          <span className="absolute top-[16px] h-[36px] w-[200px] rounded-tl-[1000px] rounded-tr-[1000px] bg-[#5FEB3C] opacity-[0.3] blur-md"></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 rounded-full px-8 py-3">
                        <Icon size={20} name="Trophy" className="text-black" />
                        <span className="max-h-[38px] min-h-[18px] min-w-[83px] max-w-[113px] text-label4 text-black">
                          Top donors
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
