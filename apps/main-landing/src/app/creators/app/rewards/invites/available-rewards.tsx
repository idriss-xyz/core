import { TOKEN } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { formatFiatValue } from '@idriss-xyz/utils';
import Image from 'next/image';

// ts-unused-exports:disable-next-line
export default function AvailableRewardsCard({
  availableRewards,
}: {
  availableRewards: number;
}) {
  return (
    <Card className="col-span-1">
      <div className="flex flex-col gap-6">
        <CardHeader className="text-label3 text-neutral-900">
          Available Rewards
        </CardHeader>
        <CardBody className="flex grow items-center">
          <div className="flex items-center gap-6">
            <div className="relative size-[70px] rounded-full">
              <Image
                src={TOKEN.IDRISS.logo}
                alt={TOKEN.IDRISS.symbol}
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <span className="flex items-center text-label1 text-black">
                  {formatFiatValue(availableRewards)}{' '}
                  <span className="ml-2 text-body4 text-gray-300">
                    {TOKEN.IDRISS.symbol}
                  </span>
                </span>
              </div>
              <Button intent="primary" size="medium" suffixIconName="Coins">
                Claim
              </Button>
            </div>
          </div>
        </CardBody>
      </div>
    </Card>
  );
}
