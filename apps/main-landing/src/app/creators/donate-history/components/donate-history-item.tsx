import { formatEther } from 'viem';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Badge } from '@idriss-xyz/ui/badge';
import { useEffect, useState } from 'react';

import { IDRISS_ICON_CIRCLE } from '@/assets';
import { getTransactionUrl } from '@/app/creators/donate/utils';
import { CHAIN } from '@/app/creators/donate/constants';

import { Node } from '../types';
import { useGetEnsAvatar } from '../commands/get-ens-avatar';
import { useGetEnsName } from '../commands/get-ens-name';

// TODO: IMPORTANT - those functions should be moved to packages/constants
export const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
};

function extractSignificantNumber(number: string) {
  const decimal = number.split('.')[1] ?? '';

  const significantPart = decimal.replace(/0+$/, '');
  const leadingZeros = /^0+/.exec(significantPart)?.[0] ?? '';

  if (!leadingZeros || leadingZeros.length < 3) {
    return { value: number, zeros: 0 };
  }

  const firstNonZero = /[1-9]/.exec(significantPart);
  const numberPart = significantPart.slice(firstNonZero?.index) ?? 0;

  return {
    value: Math.round(Number(numberPart.slice(0, 2))),
    zeros: leadingZeros.length - 1,
  };
}

const roundToSignificantFiguresForCopilotTrading = (
  number: number,
  significantFigures: number,
): { value: number | string; index: number | null } => {
  if (number === 0) {
    return {
      value: 0,
      index: null,
    };
  }

  if (number >= 1_000_000_000) {
    return {
      value: `${(number / 1_000_000_000).toFixed(significantFigures)}B`,
      index: null,
    };
  }
  if (number >= 1_000_000) {
    return {
      value: `${(number / 1_000_000).toFixed(significantFigures)}M`,
      index: null,
    };
  }
  if (number >= 1000) {
    return {
      value: `${(number / 1000).toFixed(significantFigures)}K`,
      index: null,
    };
  }

  if (number.toString().includes('e')) {
    const scienceNumberArray = number.toString().split('e-');
    const decimals = scienceNumberArray?.[1] ?? '2';
    const startingDecimals =
      scienceNumberArray?.[0]?.split('.')?.[1]?.length ?? 0;
    const { value: significantNumber, zeros: indexZeros } =
      extractSignificantNumber(
        Number(number).toFixed(Number(decimals) + Number(startingDecimals)),
      ) || {};

    return {
      value: significantNumber,
      index: indexZeros,
    };
  }

  const { value, zeros } = extractSignificantNumber(number.toString());

  if (zeros >= 2 && number < 1) {
    return {
      value,
      index: zeros,
    };
  }

  const offset = 0.000_000_001;
  const multiplier = Math.pow(10, significantFigures);
  const rounded_number =
    Math.round((number + offset) * multiplier) / multiplier;

  return {
    value: rounded_number,
    index: null,
  };
};

const getFormattedTimeDifference = (isoTimestamp: number) => {
  const currentDate = new Date();
  const targetDate = new Date(isoTimestamp);
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  const totalSeconds = Math.abs(Math.floor(differenceInMs / 1000));
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  let result = '';

  if (days > 0) {
    result += `${days} ${days > 1 ? 'days' : 'day'} `;
  }

  if (hours > 0 || days > 0) {
    result += `${hours} hrs `;
  }

  if (minutes > 0 || days > 0) {
    result += `${minutes} ${minutes > 1 ? 'mins' : 'min'}`;
  }

  if (minutes < 1 && hours < 1 && days < 1) {
    result += `${seconds} ${seconds > 1 ? 'secs' : 'sec'}`;
  }

  return result.trim();
};

export const TimeDifferenceCounter = ({
  timestamp,
  text,
}: {
  timestamp: number;
  text: string;
}) => {
  const [timeDifference, setTimeDifference] = useState(
    getFormattedTimeDifference(timestamp),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDifference(getFormattedTimeDifference(timestamp));
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, [timestamp]);

  return text ? `${timeDifference} ${text}` : timeDifference;
};

function removeMainnetSuffix(text: string) {
  const suffix = '_MAINNET';
  if (text.endsWith(suffix)) {
    return text.slice(0, -suffix.length);
  }
  return text;
}

type Properties = {
  tip: Node;
};

export default function DonateHistoryItem({ tip }: Properties) {
  const tipDetails = tip.interpretation.descriptionDisplayItems[0];
  const tipComment = tip.interpretation.descriptionDisplayItems[2];
  const tipperFromAddress = tip.transaction.fromUser.address;

  const ensNameQuery = useGetEnsName({
    address: tipperFromAddress,
  });

  const ensAvatarQuery = useGetEnsAvatar(
    {
      name: ensNameQuery.data ?? '',
    },
    {
      enabled: !!ensNameQuery.data,
    },
  );

  if (!tipDetails?.amountRaw || !tipDetails.tokenV2.marketData?.price) {
    return;
  }

  const tradeValue =
    Number.parseFloat(formatEther(BigInt(tipDetails.amountRaw))) *
    tipDetails.tokenV2.marketData.price;

  const { value: roundedNumber, index: zerosIndex } =
    roundToSignificantFiguresForCopilotTrading(
      Number.parseFloat(formatEther(BigInt(tipDetails.amountRaw))),
      2,
    );

  const transactionUrl = getTransactionUrl({
    chainId: CHAIN[removeMainnetSuffix(tip.network) as keyof typeof CHAIN].id,
    transactionHash: tip.transaction.hash,
  });

  console.log(transactionUrl);

  return (
    <div className="grid w-full grid-cols-[1fr,32px] items-start gap-x-2">
      <div className="grid w-full grid-cols-[40px,1fr] items-start gap-x-2">
        <img
          className={`size-10 rounded-full ${
            ensAvatarQuery.data ? 'border border-neutral-400' : ''
          }`}
          src={ensAvatarQuery.data ?? IDRISS_ICON_CIRCLE.src}
          alt={ensAvatarQuery.data ? 'Donor avatar' : 'IDRISS logo'}
        />

        <div className="flex flex-col justify-center gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-body3 text-neutral-900">
              <span className="align-middle">
                {ensNameQuery.data ?? getShortWalletHex(tipperFromAddress)}
              </span>{' '}
              <span className="align-middle text-body3 text-neutral-600">
                sent{' '}
                {zerosIndex ? (
                  <>
                    0.0
                    <span className="inline-block translate-y-1 px-px text-xs">
                      {zerosIndex}
                    </span>
                    {roundedNumber}
                  </>
                ) : (
                  roundedNumber
                )}{' '}
                {tipDetails.tokenV2.symbol}
              </span>{' '}
              <Badge type="success" variant="subtle" className="align-middle">
                $
                {tradeValue >= 0.01
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: tradeValue % 1 === 0 ? 0 : 2,
                      maximumFractionDigits: 2,
                    }).format(Number(tradeValue ?? 0))
                  : '<0.01'}
              </Badge>
            </p>
          </div>

          <p className="align-middle text-body5 text-neutral-600">
            {tipComment
              ? tipComment.stringValue !== 'N/A' &&
                tipComment.stringValue !== ' '
                ? tipComment.stringValue
                : null
              : null}
          </p>

          <p className="text-body6 text-mint-700">
            <TimeDifferenceCounter timestamp={tip.timestamp} text="ago" />
          </p>
        </div>
      </div>

      <IconButton size="small" intent="tertiary" iconName="EllipsisVertical" />
    </div>
  );
}
