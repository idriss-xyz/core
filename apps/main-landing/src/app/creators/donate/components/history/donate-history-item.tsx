import { formatUnits } from 'viem';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Dropdown } from '@idriss-xyz/ui/dropdown';
import { Icon } from '@idriss-xyz/ui/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { CHAIN, EMPTY_HEX, TipHistoryNode } from '@idriss-xyz/constants';
import {
  getShortWalletHex,
  getTimeDifferenceString,
  getTransactionUrls,
  roundToSignificantFiguresForCopilotTrading,
} from '@idriss-xyz/utils';
import { Link } from '@idriss-xyz/ui/link';
import { useRouter } from 'next/navigation';

import { useGetEnsAvatar } from '../../commands/get-ens-avatar';

function removeMainnetSuffix(text: string) {
  const suffix = '_MAINNET';
  if (text.endsWith(suffix)) {
    return text.slice(0, -suffix.length);
  }
  return text;
}

type Properties = {
  tip: TipHistoryNode;
  showReceiver?: boolean;
};

export default function DonateHistoryItem({ tip, showReceiver }: Properties) {
  const router = useRouter();
  const tipDetails = tip.interpretation.descriptionDisplayItems[0];
  const tipReceiver = tip.interpretation.descriptionDisplayItems[1]?.account;
  const tipComment = tip.interpretation.descriptionDisplayItems[2];
  const tipperFromAddress = tip.transaction.fromUser.address;
  const receiverAddress = tipReceiver?.address;

  const displayName = showReceiver
    ? tipReceiver?.displayName?.value
    : tip.transaction.fromUser.displayName?.value;
  const nameSource = showReceiver
    ? tipReceiver?.displayName?.source
    : tip.transaction.fromUser.displayName?.source;
  const imageSource = showReceiver
    ? tipReceiver?.avatar?.source
    : tip.transaction.fromUser.avatar?.source;

  const ensAvatarQuery = useGetEnsAvatar(
    { name: displayName ?? '' },
    { enabled: nameSource === 'ENS' && !!displayName },
  );

  const farcasterAvatarUrl =
    imageSource === 'FARCASTER'
      ? showReceiver
        ? tipReceiver?.avatar.value?.url
        : tip.transaction.fromUser.avatar?.value?.url
      : null;

  const avatarSource = ensAvatarQuery.data ?? farcasterAvatarUrl;

  if (!tipDetails?.amountRaw || !tipDetails.tokenV2?.onchainMarketData?.price) {
    return;
  }

  const tradeValue =
    Number.parseFloat(
      formatUnits(BigInt(tipDetails.amountRaw), tipDetails.tokenV2?.decimals),
    ) * tipDetails.tokenV2.onchainMarketData.price;

  const { value: roundedNumber, index: zerosIndex } =
    roundToSignificantFiguresForCopilotTrading(
      Number.parseFloat(
        formatUnits(BigInt(tipDetails.amountRaw), tipDetails.tokenV2?.decimals),
      ),
      2,
    );

  const transactionUrls = getTransactionUrls({
    chainId: CHAIN[removeMainnetSuffix(tip.network) as keyof typeof CHAIN].id,
    transactionHash: tip.transaction.hash,
  });

  return (
    <div className="grid w-full grid-cols-[1fr,32px] items-start gap-x-2">
      <div className="grid w-full grid-cols-[40px,1fr] items-start gap-x-2">
        {avatarSource ? (
          <img
            className="size-10 rounded-full border border-neutral-400"
            src={avatarSource}
            alt="Donor avatar"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
            <Icon
              size={25}
              name="CircleUserRound"
              className="text-neutral-500"
            />
          </div>
        )}

        <div className="flex flex-col justify-center gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="flex flex-row flex-wrap items-center gap-x-1 text-body3 text-neutral-900">
              <Link
                size="xs"
                onClick={() => {
                  if (showReceiver && receiverAddress) {
                    router.push(`/creators/donor/${receiverAddress}`);
                  } else {
                    router.push(`/creators/donor/${tipperFromAddress}`);
                  }
                }}
                className="cursor-pointer border-0 align-middle text-label3 text-neutral-900 no-underline lg:text-label3"
              >
                {showReceiver
                  ? (displayName ??
                    getShortWalletHex(receiverAddress ?? EMPTY_HEX))
                  : (displayName ?? getShortWalletHex(tipperFromAddress))}
              </Link>{' '}
              <span className="align-middle text-body3 text-neutral-600">
                {showReceiver ? 'received' : 'sent'}{' '}
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
                {tipDetails.tokenV2.symbol}{' '}
              </span>
              <img
                className="size-6 rounded-full"
                src={tipDetails.tokenV2.imageUrlV2}
                alt=""
              />{' '}
              <Badge type="success" variant="subtle">
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

          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="w-fit text-body6 text-mint-700">
                  {getTimeDifferenceString({
                    text: 'ago',
                    variant: 'short',
                    timestamp: tip.timestamp,
                  })}
                </p>
              </TooltipTrigger>

              <TooltipContent className="w-fit bg-black text-white">
                <p className="text-body6">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                    .format(new Date(tip.timestamp))
                    .replaceAll('/', '-')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Dropdown
        className="z-extensionPopup rounded-xl border border-neutral-300 bg-white py-2 shadow-lg"
        contentAlign="end"
        trigger={() => {
          return (
            <IconButton
              size="small"
              intent="tertiary"
              iconName="EllipsisVertical"
            />
          );
        }}
      >
        {() => {
          return transactionUrls ? (
            <ul className="flex flex-col items-start gap-y-1">
              {transactionUrls.map((transactionUrl) => {
                const explorer =
                  transactionUrl.blockExplorer === 'Blockscout'
                    ? 'Blockscout'
                    : 'Etherscan';

                return (
                  <li key={transactionUrl.url}>
                    <Button
                      asLink
                      isExternal
                      size="large"
                      intent="tertiary"
                      href={transactionUrl.url}
                      prefixIconName={explorer}
                      prefixIconClassName="mr-3"
                      className="w-full items-center px-3 py-1 font-normal text-neutral-900"
                    >
                      View on {explorer}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null;
        }}
      </Dropdown>
    </div>
  );
}
