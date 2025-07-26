import { Card } from '@idriss-xyz/ui/card';

// ts-unused-exports:disable-next-line
const SkeletonSetup = () => {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      {/* Banner */}
      <Card className="border border-neutral-200 p-0 shadow-none">
        <div className="flex h-[180px] items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="h-[15px] w-[298px] rounded-full bg-neutral-100" />
            <div className="flex justify-between">
              {[...Array.from({ length: 3 }).keys()].map((index) => {
                return (
                  <div
                    key={index}
                    className="h-[15px] w-[91px] rounded-full bg-neutral-100"
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="w-full">
          {/* Header */}
          <div className="flex h-[44px] border-b border-neutral-200 bg-neutral-100">
            <div className="w-[40px]" />
            <div className="flex-1" />
            <div className="flex-1" />
            <div className="flex-1" />
            <div className="flex-1" />
          </div>

          {/* Body */}
          {Array.from({ length: 10 }).map((_, index) => {
            return (
              <div
                key={index}
                className="flex h-[65px] items-center border-b border-neutral-200"
              >
                <div className="w-[40px] pl-4 pr-2">
                  <div className="size-[10px] rounded-full bg-neutral-100" />
                </div>
                <div className="flex-1 pl-4 pr-2">
                  <div className="flex items-center gap-[6px]">
                    <div className="size-8 rounded-full bg-neutral-100" />
                    <div className="h-[10px] w-[120px] rounded-md bg-neutral-100" />
                  </div>
                </div>
                <div className="flex-1 pl-4 pr-2">
                  <div className="h-[10px] w-[200px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex-1 pl-4 pr-2">
                  <div className="h-[10px] w-[200px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex-1 pl-4 pr-2">
                  <div className="h-[10px] w-[180px] rounded-md bg-neutral-100" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Footer */}
      <Card className="h-[136px] items-center justify-center border border-neutral-200 p-3 shadow-none">
        <div className="size-full rounded-2xl bg-neutral-100" />
      </Card>
    </div>
  );
};

// ts-unused-exports:disable-next-line
export default SkeletonSetup;
