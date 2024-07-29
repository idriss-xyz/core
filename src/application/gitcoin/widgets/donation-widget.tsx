import { memo, useCallback, useState } from 'react';

import { IdrissSend } from 'shared/idriss';
import {
  GetTokenPriceCommand,
  TOKEN,
  ethToDollars,
  roundToSignificantFigures,
  useWallet,
  weiToEth,
} from 'shared/web3';
import { ErrorMessage, GasIcon, Spinner } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';

import { DonationPayload, Recipient } from '../types';
import {
  GET_ETH_PER_DOLLAR_COMMAND_DETAILS,
  GITCOIN_ICON,
  MIN_CROSS_CHAIN_DONATION_AMOUNT,
} from '../constants';
import { getLoadingMessage } from '../utils';
import { SomethingWentWrongMessage } from '../components';
import { useDonationMaker, useFees, useDonationForm } from '../hooks';

interface Properties {
  recipient: Recipient;
}

interface BaseProperties extends Properties {
  onClose: () => void;
}

const Base = ({ recipient, onClose }: BaseProperties) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpened(false);
    onClose();
  }, [onClose]);

  const getEthPerDollarQuery = useCommandQuery({
    command: new GetTokenPriceCommand(GET_ETH_PER_DOLLAR_COMMAND_DETAILS),
    refetchInterval: 60_000,
    select: (v) => {
      return Number(v.price);
    },
    retry: 0,
    enabled: isOpened,
  });

  const ethPerDollar = getEthPerDollarQuery.data ?? 0;

  const { nodeToInject, username, isHandleUser, application } = recipient;

  const { wallet } = useWallet();

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
    [ethPerDollar, feesQuery.data],
  );

  const donationMaker = useDonationMaker({ wallet });

  const submit = useCallback(
    async (data: DonationPayload) => {
      await donationMaker.donate({
        application,
        options: data,
        ethPerDollar,
      });
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

  const iconSize = isHandleUser ? 22 : 16;
  const iconSource = GITCOIN_ICON;

  return (
    <IdrissSend.Container
      node={nodeToInject}
      iconSrc={iconSource}
      iconSize={iconSize}
      recipientName={username}
      closeOnClickAway={donationMaker.isIdle}
      onClose={handleClose}
      onOpen={handleOpen}
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
            <IdrissSend.Heading>Donate to @{username}</IdrissSend.Heading>
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
};

export const DonationWidget = memo((properties: Properties) => {
  const [closeCount, setCloseCount] = useState(0);

  const handleClose = useCallback(() => {
    setCloseCount((previous) => {
      return previous + 1;
    });
  }, []);

  return <Base {...properties} key={closeCount} onClose={handleClose} />;
});
DonationWidget.displayName = 'DonationWidget';
