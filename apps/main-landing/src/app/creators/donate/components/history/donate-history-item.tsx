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
import {
  CHAIN,
  getShortWalletHex,
  getTimeDifferenceString,
  getTransactionUrls,
  roundToSignificantFiguresForCopilotTrading,
  TipHistoryNode,
} from '@idriss-xyz/constants';

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
};

export default function DonateHistoryItem({ tip }: Properties) {
  const tipDetails = tip.interpretation.descriptionDisplayItems[0];
  const tipComment = tip.interpretation.descriptionDisplayItems[2];
  const tipperFromAddress = tip.transaction.fromUser.address;

  const displayName = tip.transaction.fromUser.displayName?.value;
  const nameSource = tip.transaction.fromUser.displayName?.source;
  const imageSource = tip.transaction.fromUser.avatar?.source;

  const ensAvatarQuery = useGetEnsAvatar(
    { name: displayName ?? '' },
    { enabled: nameSource === 'ENS' && !!displayName },
  );

  const farcasterAvatarUrl =
    imageSource === 'FARCASTER'
      ? tip.transaction.fromUser.avatar?.value?.url
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
            <p className="text-body3 text-neutral-900">
              <span className="align-middle">
                {displayName ?? getShortWalletHex(tipperFromAddress)}
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
                {tipDetails.tokenV2.symbol}{' '}
                <img
                  className="inline-block size-6 rounded-full"
                  src={tipDetails.tokenV2.imageUrlV2}
                  alt=""
                />
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
                      prefixIconClassName="mr-3"
                      prefixIconName={explorer}
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
