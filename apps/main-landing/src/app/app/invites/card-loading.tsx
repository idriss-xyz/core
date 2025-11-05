import { Card } from '@idriss-xyz/ui/card';

const SkeletonCard = () => {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      {/* 3 summary cards --------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: Successful invites */}
        <Card className="col-span-1 flex h-[150px] flex-col border border-neutral-200 bg-white p-0 shadow-none">
          {[...Array.from({ length: 1 }).keys()].map((index) => {
            return (
              <div key={index} className="flex flex-col gap-[6px] p-8">
                <div className="flex h-[10px] flex-row justify-between gap-3">
                  <div className="h-full w-[250px] rounded-md bg-neutral-100" />
                  <div className="h-full w-[39px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Card 1: Invite rank */}
        <Card className="col-span-1 flex h-[150px] flex-col border border-neutral-200 bg-white p-0 shadow-none">
          {[...Array.from({ length: 1 }).keys()].map((index) => {
            return (
              <div key={index} className="flex flex-col gap-[6px] p-8">
                <div className="flex h-[10px] flex-row justify-between gap-3">
                  <div className="h-full w-[250px] rounded-md bg-neutral-100" />
                  <div className="h-full w-[39px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Card 1: Network earnings */}
        <Card className="col-span-1 flex h-[150px] flex-col border border-neutral-200 bg-white p-0 shadow-none">
          {[...Array.from({ length: 1 }).keys()].map((index) => {
            return (
              <div key={index} className="flex flex-col gap-[6px] p-8">
                <div className="flex h-[10px] flex-row justify-between gap-3">
                  <div className="h-full w-[250px] rounded-md bg-neutral-100" />
                  <div className="h-full w-[39px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Table skeleton ---------------------------------------------------- */}
      <Card className="border border-neutral-200 p-0 shadow-none">
        <div className="w-full">
          {/* Table header */}
          <div className="flex h-[44px] border-b border-neutral-200 bg-neutral-100">
            <div className="w-[40px]" />
            <div className="flex-1" />
            <div className="flex-1" />
            <div className="flex-1" />
            <div className="flex-1" />
          </div>

          {/* Table body */}
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
    </div>
  );
};

// ts-unused-exports:disable-next-line
export default SkeletonCard;
