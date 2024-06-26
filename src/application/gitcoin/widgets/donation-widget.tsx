import { memo, useCallback, useState } from 'react';

import { IdrissSend } from 'shared/idriss';
import {
  TOKEN,
  ethToDollars,
  roundToSignificantFigures,
  useWallet,
  weiToEth,
} from 'shared/web3';
import { ErrorMessage, GasIcon, Spinner } from 'shared/ui';

import { Application, DonationPayload } from '../types';
import { GITCOIN_ICON, MIN_CROSS_CHAIN_DONATION_AMOUNT } from '../constants';
import { getLoadingMessage } from '../utils';
import { SomethingWentWrongMessage } from '../components';
import { useDonationMaker, useFees, useDonationForm } from '../hooks';

interface Properties {
  application: Application;
  node: HTMLElement;
  username: string;
  iconSize: number;
  ethPerDollar: number;
}

export const DonationWidget = memo(
  ({ application, node, username, iconSize, ethPerDollar }: Properties) => {
    const [closeOnClickAway, setCloseOnClickAway] = useState(true);
    const { wallet } = useWallet();

    const icon = {
      size: iconSize,
      src: GITCOIN_ICON,
    };

    const {
      amount,
      userAmountInWei,
      onChangeChainId,
      formMethods,
      isCrossChain,
      debouncedAmount,
      chainId,
      chainIdOptions,
    } = useDonationForm({
      application,
      ethPerDollar,
    });

    const feesQuery = useFees({
      application,
      amountInWei: userAmountInWei,
      enabled: debouncedAmount >= MIN_CROSS_CHAIN_DONATION_AMOUNT,
    });

    const getChainFeeInDollars = useCallback(
      (chainId: number) => {
        if (!feesQuery.data) {
          return 0;
        }

        const feeInWei = feesQuery.data[chainId]?.totalRelayFee.total
          ? Number(feesQuery.data[chainId]?.totalRelayFee.total)
          : 0;
        const feeInEth = weiToEth(feeInWei);
        const feeInDollars = ethToDollars(feeInEth, ethPerDollar);

        return feeInDollars;
      },
      [feesQuery.data, ethPerDollar],
    );

    const donationMaker = useDonationMaker({ wallet });

    const submit = useCallback(
      async (data: DonationPayload) => {
        try {
          setCloseOnClickAway(false);
          await donationMaker.donate({
            application,
            options: data,
            ethPerDollar,
          });
        } catch {
          setCloseOnClickAway(true);
        }
      },
      [application, donationMaker, ethPerDollar],
    );

    const renderChainSuffix = useCallback(
      (renderedChainId: number) => {
        if (renderedChainId === application.chainId) {
          return null;
        }

        if (feesQuery.isLoading) {
          return (
            <div className="flex w-full items-center justify-end">
              <Spinner className="size-2" />
            </div>
          );
        }

        const feeInDollars = getChainFeeInDollars(renderedChainId);
        return (
          <>
            {feeInDollars > 0 ? (
              <p className="flex w-full items-center justify-end space-x-1 text-xs text-gray-500">
                <span>{`$${feeInDollars}`}</span>
                <span>+</span>
                <GasIcon />
              </p>
            ) : null}
          </>
        );
      },
      [application.chainId, feesQuery.isLoading, getChainFeeInDollars],
    );

    return (
      <IdrissSend.Container
        widgetDataAttribute="gitcoin-donation-widget"
        node={node}
        iconSrc={icon.src}
        iconSize={icon.size}
        recipientName={username}
        closeOnClickAway={closeOnClickAway}
      >
        {({ close }) => {
          if (donationMaker.isDonating) {
            return (
              <IdrissSend.Loading
                heading={
                  <>
                    Sending{' '}
                    <span className="font-bold text-idriss-primary-500">
                      ${amount}
                    </span>{' '}
                    ({roundToSignificantFigures(userAmountInWei / 10 ** 18, 2)}{' '}
                    ETH)
                  </>
                }
                recipient={username}
              >
                {getLoadingMessage(isCrossChain)}
              </IdrissSend.Loading>
            );
          }

          if (donationMaker.isSuccess) {
            return (
              <IdrissSend.Success
                onConfirm={close}
                chainId={chainId}
                transactionHash={donationMaker.data?.transactionHash ?? ''}
              />
            );
          }

          return (
            <>
              <IdrissSend.Heading>Donate to @${username}</IdrissSend.Heading>
              <IdrissSend.Form
                formMethods={formMethods}
                tokens={[{ ...TOKEN.ETHEREUM, decimals: 18, address: '0x0' }]}
                onSubmit={submit}
                className="mt-4"
                allowedChainsIds={chainIdOptions}
                renderChainSuffix={renderChainSuffix}
                onChangeChainId={onChangeChainId}
                footer={
                  <>
                    {wallet ? (
                      <IdrissSend.SubmitButton
                        loading={feesQuery.isLoading}
                        disabled={feesQuery.isError}
                      >
                        Donate
                      </IdrissSend.SubmitButton>
                    ) : (
                      <IdrissSend.ConnectWalletButton />
                    )}
                    {feesQuery.isError ? (
                      <SomethingWentWrongMessage onRetry={feesQuery.refetch} />
                    ) : null}
                    {donationMaker.isError ? (
                      <ErrorMessage className="mt-4">
                        Something went wrong.
                      </ErrorMessage>
                    ) : null}
                  </>
                }
              />
            </>
          );
        }}
      </IdrissSend.Container>
    );
  },
);

DonationWidget.displayName = 'DonationWidget';
