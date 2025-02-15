// File: /src/app/creators/donate-history/components/top-donors.tsx
'use client';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { formatEther, Hex } from 'viem';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@idriss-xyz/ui/spinner';

import { IDRISS_SCENE_STREAM_2 } from '@/assets';
import { validateAddressOrENS } from '@/app/creators/donate/utils';
import { hexSchema } from '@/app/creators/donate/schema';
import {
  default as DonorItem,
  DonorItemPlaceholder,
} from '@/app/creators/donate/components/donor-item';
import { useGetTipHistory } from '@/app/creators/donate-history/commands/get-donate-history';
import { Node } from '@/app/creators/donate-history/types';

import { SEARCH_PARAMETER } from './content';

type Properties = {
  className?: string;
};

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

export const TopDonors = ({ className }: Properties) => {
  const [validatedAddress, setValidatedAddress] = useState<
    string | null | undefined
  >();

  const searchParameters = useSearchParams();
  const addressFromParameters =
    searchParameters.get(SEARCH_PARAMETER.ADDRESS) ??
    searchParameters.get(SEARCH_PARAMETER.LEGACY_ADDRESS);

  useEffect(() => {
    const validateAddress = async () => {
      const address = await validateAddressOrENS(addressFromParameters);
      setValidatedAddress(address);
    };

    void validateAddress();
  }, [addressFromParameters]);

  const addressValidationResult = hexSchema.safeParse(validatedAddress);

  const tips = useGetTipHistory(
    {
      address: (validatedAddress as Hex) ?? '0x',
    },
    {
      enabled: addressValidationResult.success,
    },
  );

  const tipEdges = tips.isSuccess ? tips.data?.data : undefined;

  const groupedTips = tipEdges?.reduce(
    (accumulator, tip) => {
      const userAddress = tip.node.transaction.fromUser.address;
      const amountRaw =
        tip.node.interpretation.descriptionDisplayItems[0]?.amountRaw;
      const price =
        tip.node.interpretation.descriptionDisplayItems[0]?.tokenV2
          ?.onchainMarketData?.price;

      if (!amountRaw || !price) {
        return accumulator;
      }

      const tradeValue =
        Number.parseFloat(formatEther(BigInt(amountRaw))) * price || 0;

      if (!accumulator[userAddress]) {
        accumulator[userAddress] = {
          tips: [] as { node: Node }[],
          tipsSum: 0,
          address: userAddress,
        };
      }

      accumulator[userAddress].tips.push(tip);
      accumulator[userAddress].tipsSum += tradeValue;

      return accumulator;
    },
    {} as Record<
      string,
      { tipsSum: number; address: Hex; tips: { node: Node }[] }
    >,
  );

  const sortedGroupedTips = groupedTips
    ? Object.values(groupedTips).sort((a, b) => {
        return b.tipsSum - a.tipsSum;
      })
    : undefined;

  return (
    <div className={classes(className, baseClassName)}>
      <div className="relative flex min-h-[100px] w-full items-center justify-center overflow-hidden">
        <img
          src={IDRISS_SCENE_STREAM_2.src}
          alt=""
          className="absolute -left-5 -top-1 h-[110px] w-[640px] max-w-none object-cover"
        />
        <span className="absolute left-0 top-0 size-full bg-black/20" />
        <h1 className="relative z-1 mx-12 my-6 text-center text-heading4 uppercase text-white">
          Top donors
        </h1>
      </div>
      <div className="flex w-full flex-col">
        {sortedGroupedTips ? (
          <ul>
            {sortedGroupedTips.map((groupedTip, index) => {
              if (!groupedTip.tips[0] || index > 5) return null;

              return (
                <DonorItem
                  donorRank={index}
                  donateAmount={groupedTip.tipsSum}
                  donorAddress={groupedTip.address}
                  key={`${groupedTip.tipsSum}${groupedTip.tips[0].node.transaction.hash}`}
                />
              );
            })}

            {sortedGroupedTips.length <= 5 ? (
              <DonorItemPlaceholder
                donorRank={sortedGroupedTips.length}
                previousDonateAmount={sortedGroupedTips.at(-1)?.tipsSum ?? 1234}
              />
            ) : null}
          </ul>
        ) : (
          <span className="flex w-full items-center justify-center px-5.5 py-4.5">
            <Spinner className="size-16" />
          </span>
        )}
      </div>
      <div className="flex min-h-[80px] w-full items-center justify-center">
        <Link
          size="xs"
          href={`donate-history?address=${validatedAddress}`}
          className={`mx-6 my-3 ${sortedGroupedTips?.length === 0 ? 'invisible' : ''}`}
        >
          See full donation history
        </Link>
      </div>
    </div>
  );
};
