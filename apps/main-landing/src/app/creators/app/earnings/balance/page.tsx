'use client';

import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { BalanceTableItem } from '@idriss-xyz/constants';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';
import { formatFiatValue } from '@idriss-xyz/utils';
import { useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { Icon } from '@idriss-xyz/ui/icon';
import { useQueryClient } from '@tanstack/react-query';

import { IDRISS_SCENE_STREAM_4 } from '@/assets';
import { WithdrawWidget } from '@/app/creators/components/withdraw-widget';
import { WithdrawCollectibleWidget } from '@/app/creators/components/withdraw-widget/withdraw-collectible-widget';
import { CopyButton } from '@/app/creators/components/copy-button/copy-button';

import {
  useGetCollectibleBalances,
  useGetTokenBalances,
} from '../commands/get-balances';
import { useAuth } from '../../../context/auth-context';
import SkeletonRanking from '../loading';

import { BalanceTable } from './balance-table';
import CollectibleBalanceGallery from './collectible-balance-gallery';

// ts-unused-exports:disable-next-line
export default function EarningsBalance() {
  const { user, ready, authenticated } = usePrivy();
  const { creator } = useAuth();
  const queryClient = useQueryClient();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>();
  const [activeTab, setActiveTab] = useState<'Tokens' | 'Collectibles'>(
    'Tokens',
  );
  const address = user?.wallet?.address as Hex | undefined;

  const { data, isLoading, isError } = useGetTokenBalances(
    { address },
    { enabled: ready && authenticated && !!address },
  );

  const {
    data: collectiblesData,
    isLoading: isLoadingCollectibles,
    isError: isErrorCollectibles,
  } = useGetCollectibleBalances(
    { address },
    {
      enabled: ready && authenticated && !!address,
    },
  );

  const tokenBalancesData = data?.tokenResult;
  const collectiblesBalanceData = collectiblesData?.nftResult;

  const tokenTotal = tokenBalancesData?.summary.totalUsdBalance ?? 0;
  const collectiblesTotal =
    collectiblesBalanceData?.summary.totalUsdBalance ?? 0;
  const totalUsdBalance =
    activeTab === 'Tokens' ? tokenTotal : collectiblesTotal;
  const heading =
    activeTab === 'Tokens' ? 'Available balance' : 'Estimated value';

  const tokenApiBalances = tokenBalancesData?.balances ?? [];
  const collectiblesApiBalances = collectiblesBalanceData?.balances ?? [];

  const aggregatedBalances: Record<string, BalanceTableItem> = {};
  for (const balance of tokenApiBalances) {
    const existing = aggregatedBalances[balance.symbol];

    if (existing) {
      existing.totalAmount += Number(balance.balance);
      existing.totalValue += balance.usdValue;
    } else {
      aggregatedBalances[balance.symbol] = {
        totalAmount: Number(balance.balance),
        totalValue: balance.usdValue,
        token: {
          address: balance.address,
          symbol: balance.symbol,
          name: balance.name,
          imageUrl: balance.imageUrl ?? '',
          network: 'Multiple',
          decimals: balance.decimals,
        },
      };
    }
  }

  const tableData: BalanceTableItem[] = Object.values(aggregatedBalances);

  const hasTokens = !isLoading && !isError && tableData.length > 0;
  const hasCollectibles =
    !isLoadingCollectibles &&
    !isErrorCollectibles &&
    (collectiblesBalanceData?.balances.length ?? 0) > 0;
  const hasBalance = activeTab === 'Tokens' ? hasTokens : hasCollectibles;

  if (
    !ready ||
    !authenticated ||
    (activeTab === 'Tokens' ? isLoading : isLoadingCollectibles)
  ) {
    return <SkeletonRanking />;
  }

  const NoDonations = (
    <div className="mx-auto flex min-h-[548px] w-[477px] flex-col items-center justify-center gap-4">
      <span
        className={classes(
          'text-center text-heading6 uppercase text-neutral-900',
        )}
      >
        No donations yet
      </span>
      <span
        className={classes(
          'mx-8 text-center text-display5 uppercase gradient-text',
        )}
      >
        Share your page to get your first donation
      </span>
      <CopyButton
        text={creator?.donationUrl ?? ''}
        disabled={!creator?.donationUrl}
      />
    </div>
  );

  // Tabs definition for Tokens/Collectibles
  const balanceTabs: TabItem[] = [
    {
      name: 'Tokens',
      iconName: 'Coins',
      isActive: activeTab === 'Tokens',
      onClick: () => {
        return setActiveTab('Tokens');
      },
    },
    {
      name: 'Collectibles',
      iconName: 'Card',
      isActive: activeTab === 'Collectibles',
      onClick: () => {
        return setActiveTab('Collectibles');
      },
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-3 p-0">
        <div className="relative h-[250px] overflow-hidden rounded-2xl">
          <img
            alt="idriss stream"
            src={IDRISS_SCENE_STREAM_4.src}
            className="absolute inset-0 size-full object-cover object-[center_10%] lg:object-[center_33%] 3xl:object-[center_40%]"
          />
          <div className="relative flex flex-col items-center gap-2 px-4 py-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-x-1">
                <h4 className={classes('text-heading4')}>{heading}</h4>
                {activeTab !== 'Tokens' && (
                  <TooltipProvider delayDuration={400}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon
                          className="text-neutral-600"
                          name="HelpCircle"
                          size={24}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-left text-white">
                        <p className="text-label6">
                          Based on the current highest market offers
                          <br />
                          on{' '}
                          <a
                            href="https://opensea.io/"
                            className="text-mint-500 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            OpenSea
                          </a>
                          . Actual sale prices may vary.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <h2 className={classes('text-heading2 gradient-text')}>
                {formatFiatValue(totalUsdBalance)}
              </h2>
            </div>
            <div className="flex gap-2">
              {hasBalance && (
                <Button
                  intent="primary"
                  size="small"
                  className="uppercase"
                  prefixIconName="ArrowDownFromLine"
                  onClick={() => {
                    return setIsWithdrawModalOpen(true);
                  }}
                >
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      <Card className="col-span-3 p-0">
        <div className="flex items-center gap-4 p-4">
          <span className={classes('text-label3')}>Assets</span>
          <TabsPill tabs={balanceTabs} />
        </div>

        {activeTab === 'Tokens' ? (
          hasTokens ? (
            <BalanceTable
              data={tableData}
              setSelectedToken={setSelectedToken}
              setIsWithdrawModalOpen={setIsWithdrawModalOpen}
            />
          ) : (
            NoDonations
          )
        ) : hasCollectibles ? (
          <CollectibleBalanceGallery
            collectibles={collectiblesBalanceData?.balances ?? []}
          />
        ) : (
          NoDonations
        )}
      </Card>
      {activeTab === 'Tokens' ? (
        <WithdrawWidget
          isOpen={isWithdrawModalOpen}
          balances={tokenApiBalances}
          selectedToken={selectedToken}
          onClose={() => {
            void queryClient.invalidateQueries({
              queryKey: ['token-balances'],
            });
            return setIsWithdrawModalOpen(false);
          }}
        />
      ) : (
        <WithdrawCollectibleWidget
          isOpen={isWithdrawModalOpen}
          nftBalances={collectiblesApiBalances}
          onClose={() => {
            void queryClient.invalidateQueries({
              queryKey: ['collectible-balances'],
            });
            return setIsWithdrawModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
