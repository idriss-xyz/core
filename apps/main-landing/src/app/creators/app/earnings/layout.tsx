import { Icon } from '@idriss-xyz/ui/icon';

// ts-unused-exports:disable-next-line
export default function EarningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex gap-2.5">
              <span className="max-h-[48px] min-h-4.5 min-w-[46px] max-w-[76px] text-body6 text-neutral-800">
                Earnings
              </span>
            </div>
            <div className="size-[16px] max-h-[46px] min-h-[16px] min-w-[16px] max-w-[46px]">
              <Icon name="IdrissArrowRight" size={16} className="text-black" />
            </div>

            <div className="flex gap-2.5">
              <span className="h-4.5 max-h-[48px] min-h-4.5 w-[79px] min-w-[79px] max-w-[109px] text-body6 text-neutral-800">
                Stats & history
              </span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <div className="flex h-[40px] max-h-[70px] min-h-[40px] w-[213px] min-w-[213px] max-w-[243px] items-center">
              <h1 className="col-span-3 my-4 text-heading3">Earnings</h1>
            </div>
          </div>
        </div>

        <div className="flex min-w-[1166px] max-w-[1196px] gap-1">
          <div className="flex gap-1 rounded-full border border-neutral-300 bg-white p-1">
            <div className="flex items-center justify-center gap-2 rounded-full px-8 py-3">
              <Icon size={20} name="Wallet" className="text-black" />
              <span className="max-h-[38px] min-h-4.5 min-w-[59px] max-w-[89px] text-label4 text-black">
                Balance
              </span>
            </div>

            <div>
              <div className="relative flex max-h-[74px] min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full border border-[#5FEB3C] bg-white px-8 py-2 text-neutralGreen-900">
                <Icon name="LineChart" size={20} />
                <span className="relative z-1 max-h-[48] min-h-4.5 min-w-[108] max-w-[138] text-label4 text-black">
                  Stats & history
                </span>
                <span className="absolute top-[16px] h-[36px] w-[200px] rounded-t-[1000px] bg-[#5FEB3C] opacity-30 blur-md" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-full px-8 py-3">
              <Icon size={20} name="Trophy" className="text-black" />
              <span className="max-h-[38px] min-h-4.5 min-w-[83px] max-w-[113px] text-label4 text-black">
                Top donors
              </span>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
