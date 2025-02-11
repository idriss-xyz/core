import { formatEther } from 'viem';
import { Link } from '@idriss-xyz/ui/link';

import { IDRISS_ICON_CIRCLE } from '@/assets';
import { useGetEnsName } from '@/app/creators/tip-history/commands/get-ens-name';
import { useGetEnsAvatar } from '@/app/creators/tip-history/commands/get-ens-avatar';
import { Node } from '@/app/creators/tip-history/types';
import { getTransactionUrl } from '@/app/creators/donate/utils';
import { CHAIN } from '@/app/creators/donate/constants';

// TODO: use function from shared after moving it from extension to packages
const roundToSignificantFigures = (
  number: number,
  significantFigures: number,
): number | string => {
  if (number === 0) {
    return 0;
  }

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(significantFigures)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(significantFigures)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(significantFigures)}K`;
  }

  const multiplier = Math.pow(
    10,
    significantFigures - Math.floor(Math.log10(Math.abs(number))) - 1,
  );

  return Math.round(number * multiplier) / multiplier;
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

export default function TipHistoryItem({ tip }: Properties) {
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

  return (
    <div className="grid w-full grid-cols-[6fr,3fr] items-center gap-x-6">
      <div className="z-1 flex w-full items-start gap-x-2 rounded-xl bg-white p-4 shadow-lg">
        <div className="flex shrink-0 items-center justify-center">
          <img
            className={`size-12 rounded-full ${
              ensAvatarQuery.data ? 'border border-neutral-400' : ''
            }`}
            src={ensAvatarQuery.data ?? IDRISS_ICON_CIRCLE.src}
            alt={ensAvatarQuery.data ? 'Donor avatar' : 'IDRISS logo'}
          />
        </div>

        <div className="flex flex-col justify-center gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-label3 text-neutral-900">
              {ensNameQuery.data ?? tipperFromAddress}{' '}
              <span className="text-body3 text-neutral-600">
                sent $
                {tradeValue >= 0.01
                  ? roundToSignificantFigures(tradeValue, 2)
                  : '<0.01'}
              </span>
            </p>
          </div>

          <p className="align-middle text-body5 text-neutral-600">
            Tipped{' '}
            {tipDetails.tokenV2.imageUrlV2 ? (
              <img
                alt=""
                className="inline-block size-6"
                src={tipDetails.tokenV2.imageUrlV2}
              />
            ) : null}{' '}
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
            )}
            {tipDetails.tokenV2.symbol}
            {tipComment
              ? tipComment.stringValue !== 'N/A' &&
                tipComment.stringValue !== ' '
                ? ` with comment: ${tipComment.stringValue}`
                : null
              : null}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-y-2 text-body5">
        <span>
          {new Date(tip.timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </span>

        <span>
          {formatEther(BigInt(tipDetails.amountRaw))}{' '}
          {tipDetails.tokenV2.symbol}
        </span>

        <Link
          size="medium"
          href={transactionUrl}
          isExternal
          className="text-body5 lg:text-body5"
        >
          View on explorer
        </Link>
      </div>
    </div>
  );
}
