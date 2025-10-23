import { formatUnits } from 'viem';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Dropdown } from '@idriss-xyz/ui/dropdown';
import { Icon } from '@idriss-xyz/ui/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@idriss-xyz/ui/tooltip';
import {
  CREATOR_CHAIN,
  StoredDonationData,
  CREATOR_API_URL,
} from '@idriss-xyz/constants';
import {
  getTransactionUrls,
  formatFiatValue,
  formatTokenValue,
} from '@idriss-xyz/utils';
import { Link } from '@idriss-xyz/ui/link';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@privy-io/react-auth';
import { classes } from '@idriss-xyz/ui/utils';

import { useTimeAgo } from '../../hooks/use-time-ago';

import { removeMainnetSuffix } from '@/app/donate/utils';
import { TokenLogo } from '@/app/app/earnings/stats-and-history/token-logo';
import { useToast } from '@/app/context/toast-context';


type Properties = {
  donation: StoredDonationData;
  showReceiver?: boolean;
  showMenu?: boolean;
  canReplay?: boolean;
};

export const DonateHistoryItem = ({
  donation,
  showReceiver = false,
  showMenu = true,
  canReplay = false,
}: Properties) => {
  const timeAgo = useTimeAgo({ timestamp: donation.timestamp });
  const router = useRouter();
  const { toast } = useToast();
  /* ——— distinguish donation type ——— */
  const isTokenDonation = donation.kind === 'token';

  const tokenSymbol = isTokenDonation ? donation.token.symbol : donation.name;
  const tipReceiver = donation.toUser;
  const tradeValue = donation.tradeValue;
  const tipComment = donation.comment;
  const tokenImage = isTokenDonation
    ? donation.token.imageUrl
    : donation.imgSmall;

  const tokenDecimals = isTokenDonation ? donation.token.decimals : 0;

  const formattedAmount = isTokenDonation
    ? formatTokenValue(
        Number.parseFloat(
          formatUnits(BigInt(donation.amountRaw), tokenDecimals),
        ),
      )
    : donation.quantity.toString();

  const showAmount = isTokenDonation || formattedAmount !== '1';

  const receiverName = tipReceiver.displayName;
  const tipperFromName = donation.fromUser.displayName;

  const nameToDisplay = showReceiver
    ? (tipReceiver?.displayName ?? 'anon')
    : (donation.fromUser.displayName ?? 'anon');

  const redirectUrl = showReceiver
    ? `/${receiverName}`
    : `/fan/${tipperFromName}`;

  const avatarSource = showReceiver
    ? tipReceiver.avatarUrl
    : donation.fromUser.avatarUrl;

  const transactionUrls = getTransactionUrls({
    chainId:
      CREATOR_CHAIN[
        removeMainnetSuffix(donation.network) as keyof typeof CREATOR_CHAIN
      ].id,
    transactionHash: donation.transactionHash,
  });

  const replayDonation = async () => {
    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        console.error('Replay failed: no auth token');
        toast({
          type: 'error',
          heading: 'Unable to replay alert',
          description: 'Please try again later',
          autoClose: true,
        });
        return;
      }
      const response = await fetch(
        `${CREATOR_API_URL}/creator-profile/test-alert`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ donation }),
        },
      );

      if (response.ok) {
        toast({
          type: 'success',
          heading: 'Alert replayed successfully',
          description: 'Check your stream preview to confirm it shows up',
          iconName: 'BellRing',
          autoClose: true,
        });
      } else {
        const text = await response.text().catch(() => {
          return '';
        });
        console.error('Replay failed:', text || response.statusText);
        toast({
          type: 'error',
          heading: 'Unable to replay alert',
          description: 'Refresh the page and try again in a few seconds',
          iconName: 'BellRing',
          autoClose: true,
        });
      }
    } catch (error) {
      console.error('Error replaying donation:', error);
      toast({
        type: 'error',
        heading: 'Unable to replay alert',
        description: 'Refresh the page and try again in a few seconds',
        iconName: 'BellRing',
        autoClose: true,
      });
    }
  };

  return (
    <div className="grid w-full grid-cols-[1fr,32px] items-start gap-x-2">
      <div className="grid w-full grid-cols-[40px,1fr] items-start gap-x-2">
        {avatarSource ? (
          <img
            src={avatarSource}
            alt="Donor avatar"
            className="size-10 rounded-full border border-neutral-400"
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
            <p
              className={classes(
                'flex flex-row flex-wrap items-center gap-x-1 text-body3 text-neutral-900',
              )}
            >
              <Link
                size="xs"
                onClick={() => {
                  router.push(redirectUrl);
                }}
                className={classes(
                  'cursor-pointer border-0 align-middle text-label3 text-neutral-900 no-underline lg:text-label3',
                )}
              >
                {nameToDisplay}
              </Link>{' '}
              <span
                className={classes('align-middle text-body3 text-neutral-600')}
              >
                {showReceiver ? 'received' : 'sent'}{' '}
                {showAmount && `${formattedAmount}`} {tokenSymbol}{' '}
              </span>
              <span className="relative inline-block size-6 align-middle">
                <TokenLogo symbol={tokenSymbol} imageUrl={tokenImage} />
              </span>{' '}
              {!isTokenDonation && tradeValue === 0 ? (
                <div className="flex items-center gap-x-1">
                  <Badge type="success" variant="subtle">
                    –
                  </Badge>
                  <TooltipProvider delayDuration={400}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon
                          className="text-neutral-600"
                          name="HelpCircle"
                          size={12}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-center text-white">
                        <p>
                          This collectible had no market offers at the time of
                          receiving
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <Badge type="success" variant="subtle">
                  {formatFiatValue(tradeValue)}
                </Badge>
              )}
            </p>
          </div>

          {tipComment && (
            <p className={classes('align-middle text-body5 text-neutral-600')}>
              {tipComment}
            </p>
          )}

          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className={classes('w-fit text-body6 text-mint-700')}>
                  {timeAgo}
                </p>
              </TooltipTrigger>

              <TooltipContent className="w-fit bg-black text-white">
                <p className={classes('text-body6')}>
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                    .format(new Date(donation.timestamp))
                    .replaceAll('/', '-')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showMenu && (
        <Dropdown
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
          className={classes(
            'z-extensionPopup rounded-xl border border-neutral-300 bg-white py-2 shadow-lg',
          )}
        >
          {({ close }) => {
            return (
              <ul className="flex flex-col items-start gap-y-1">
                {canReplay && (
                  <li>
                    <Button
                      size="large"
                      intent="tertiary"
                      prefixIconName="RotateCcw"
                      prefixIconClassName="mr-3"
                      className="w-full items-center px-3 py-1 font-normal text-neutral-900"
                      onClick={() => {
                        close();
                        void replayDonation();
                      }}
                    >
                      Replay alert
                    </Button>
                  </li>
                )}

                {transactionUrls?.map((transactionUrl) => {
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

                {!isTokenDonation && (
                  <li key={donation.name}>
                    <Button
                      asLink
                      isExternal
                      size="large"
                      intent="tertiary"
                      href={
                        'https://opensea.io/item/' +
                        removeMainnetSuffix(donation.network).toLowerCase() +
                        '/' +
                        donation.collectionAddress +
                        '/' +
                        donation.tokenId
                      }
                      prefixIconName="OpenSea"
                      prefixIconClassName="mr-3"
                      className="w-full items-center px-3 py-1 font-normal text-neutral-900"
                    >
                      View on OpenSea
                    </Button>
                  </li>
                )}
              </ul>
            );
          }}
        </Dropdown>
      )}
    </div>
  );
};
