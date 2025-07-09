import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';

import { IDRISS_SCENE_STREAM_4 } from '@/assets';

// ts-unused-exports:disable-next-line
export default function EarningsBalance() {
  const { balance } = { balance: 1250 }; // TODO: Replace with user address and balance
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-3 p-0">
        <div className="relative h-[224px] overflow-hidden rounded-2xl bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]">
          <img
            alt="idriss stream"
            src={IDRISS_SCENE_STREAM_4.src}
            className="absolute top-[-130px] w-full"
          />
        </div>
      </Card>
      {balance > 0 ? (
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-neutral-100 text-label6">
            <tr />
          </thead>
          <tbody />
        </table>
      ) : (
        <>
          <Card className="col-span-3">
            <div className="mx-auto flex min-h-[694px] w-[477px] flex-col items-center justify-center gap-4">
              <span className="text-center text-heading6 uppercase text-neutral-900">
                No donations yet
              </span>
              <span className="mx-8 text-center text-display5 uppercase gradient-text">
                Share your page to get your first donation
              </span>
              <Button
                size="medium"
                intent="secondary"
                onClick={() => {
                  return console.log('Not implemented yet');
                }} // TODO: Add functionality
                suffixIconName="IdrissArrowRight"
                className="uppercase"
              >
                Copy link
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
