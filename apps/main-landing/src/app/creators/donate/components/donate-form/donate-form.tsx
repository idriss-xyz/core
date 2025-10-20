/* eslint-disable @next/next/no-img-element */
'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  formatTokenValue,
  applyDecimalsToNumericString,
} from '@idriss-xyz/utils';
import {
  CREATOR_CHAIN,
  TOKEN,
  Token,
  EMPTY_HEX,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  NftBalance,
} from '@idriss-xyz/constants';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { classes } from '@idriss-xyz/ui/utils';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';

import { backgroundLines3 } from '@/assets';
import { useAuth } from '@/app/creators/context/auth-context';

import {
  FormPayload,
  SendPayload,
  createFormPayloadSchema,
} from '../../schema';
import { getSendFormDefaultValues } from '../../utils';
import { useSender } from '../../hooks';
import { useMobileFilter } from '../../hooks/use-mobile-filter';
import { CreatorProfile } from '../../types';
import { useLinkWalletIfNeeded } from '../../hooks/use-link-wallet-if-needed';
import { useDonationCallback } from '../../hooks/use-donation-callback';

import {
  DonateFormLoading,
  DonateFormSuccess,
  DonateFormWrongAddress,
  DonateFormHeader,
  DonateFormBody,
  CollectibleSelectModal,
} from './components';

type Properties = {
  className?: string;
  creatorInfo: CreatorProfile;
};

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center relative';

export const DonateForm = forwardRef<HTMLDivElement, Properties>(
  ({ className, creatorInfo }, reference) => {
    const { isConnected } = useAccount();
    const { donor } = useAuth();
    const { data: walletClient } = useWalletClient();
    const { openConnectModal } = useConnectModal();
    const [selectedTokenSymbol, setSelectedTokenSymbol] =
      useState<string>('ETH');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isCollectibleModalOpen, setIsCollectibleModalOpen] = useState(false);
    const [collectibleSearch, setCollectibleSearch] = useState('');
    const [selectedCollectible, setSelectedCollectible] =
      useState<NftBalance | null>(null);
    const [activeTab, setActiveTab] = useState<'token' | 'collectible'>(
      'token',
    );
    const [collectionFilters, setCollectionFilters] = useState<string[]>([]);
    const [pendingCollectibleModal, setPendingCollectibleModal] =
      useState(false);
    const [pendingFormSubmission, setPendingFormSubmission] = useState(false); // State to manage automatic tx sending after connecting a wallet
    const { showMobileFilter, setShowMobileFilter } = useMobileFilter();

    const minimumSfxAmount =
      creatorInfo.minimumSfxAmount ?? DEFAULT_DONATION_MIN_SFX_AMOUNT;

    const possibleTokens: Token[] = useMemo(() => {
      const tokensSymbols = (creatorInfo.token ?? '').toLowerCase().split(',');
      const allPossibleTokens = Object.values(TOKEN);
      const tokens = allPossibleTokens.filter((token) => {
        return tokensSymbols.includes(token.symbol.toLowerCase());
      });

      // TODO: sort
      if (tokens.length === 0) {
        return allPossibleTokens;
      }

      return tokens;
    }, [creatorInfo.token]);

    const allowedChainsIds = useMemo(() => {
      const networksShortNames =
        creatorInfo.network?.toLowerCase().split(',') ??
        Object.values(CREATOR_CHAIN).map((chain) => {
          return chain.shortName.toLowerCase();
        });

      const chains = Object.values(CREATOR_CHAIN).filter((chain) => {
        if (!networksShortNames.includes(chain.shortName.toLowerCase())) {
          return false;
        }

        const tokensForThisChain = CHAIN_ID_TO_TOKENS[chain.id];

        return !!tokensForThisChain?.find((token) => {
          return token.symbol === selectedTokenSymbol;
        });
      });

      if (chains.length === 0) {
        return DEFAULT_ALLOWED_CHAINS_IDS;
      }

      // TODO: sort
      return chains.map((chain) => {
        return chain.id;
      });
    }, [creatorInfo.network, selectedTokenSymbol]);

    const defaultChainId = allowedChainsIds[0] ?? 0;

    const defaultTokenSymbol = useMemo(() => {
      const chainTokens =
        CHAIN_ID_TO_TOKENS[defaultChainId]?.filter((chainToken) => {
          return possibleTokens.some((token) => {
            return (
              token.symbol.toLowerCase() === chainToken.symbol.toLowerCase()
            );
          });
        }) ?? [];

      return (
        chainTokens[0]?.symbol ??
        CHAIN_ID_TO_TOKENS[defaultChainId]?.[0]?.symbol ??
        ''
      );
    }, [defaultChainId, possibleTokens]);

    const formMethods = useForm<FormPayload>({
      defaultValues: getSendFormDefaultValues(
        defaultChainId,
        defaultTokenSymbol,
      ),
      resolver: zodResolver(createFormPayloadSchema(allowedChainsIds)),
    });

    const { reset } = formMethods;

    useEffect(() => {
      const currentTokenAmount = formMethods.getValues('tokenAmount');
      const currentCollectibleAmount =
        formMethods.getValues('collectibleAmount');
      const currentMessage = formMethods.getValues('message');
      const defaultValues = getSendFormDefaultValues(
        defaultChainId,
        selectedTokenSymbol,
      );

      // Preserve the current amounts and message if they exist
      if (currentTokenAmount !== undefined) {
        defaultValues.tokenAmount = currentTokenAmount;
      }
      if (currentCollectibleAmount !== undefined) {
        defaultValues.collectibleAmount = currentCollectibleAmount;
      }
      if (currentMessage !== undefined) {
        defaultValues.message = currentMessage;
      }

      reset(defaultValues);

      sender.resetBalance();
      setSelectedCollectible(null);

      // Set the correct form type based on what's enabled
      if (creatorInfo.collectibleEnabled && !creatorInfo.tokenEnabled) {
        formMethods.setValue('type', 'erc1155');
        setActiveTab('collectible');
      } else {
        formMethods.setValue('type', 'token');
        setActiveTab('token');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      defaultChainId,
      selectedTokenSymbol,
      reset,
      creatorInfo.collectibleEnabled,
      creatorInfo.tokenEnabled,
    ]);

    const [chainId, tokenSymbol, tokenAmount, collectibleAmount, sfx] =
      formMethods.watch([
        'chainId',
        'tokenSymbol',
        'tokenAmount',
        'collectibleAmount',
        'sfx',
      ]);

    const linkWalletIfNeeded = useLinkWalletIfNeeded(
      walletClient,
      chainId,
      setSubmitError,
      donor?.name,
    );

    const callbackOnSend = useDonationCallback(sfx);

    // Derive the current amount based on active tab
    const amount = activeTab === 'token' ? tokenAmount : collectibleAmount;

    const sender = useSender({
      walletClient,
      callbackOnSend,
    });

    // Reset SFX when amount falls below the minimum
    useEffect(() => {
      const currentAmount =
        activeTab === 'token' ? tokenAmount : collectibleAmount;
      if (currentAmount && currentAmount < minimumSfxAmount && sfx) {
        formMethods.setValue('sfx', '');
      }
    }, [
      tokenAmount,
      collectibleAmount,
      activeTab,
      sfx,
      formMethods,
      minimumSfxAmount,
    ]);
    const selectedToken = useMemo(() => {
      const token = possibleTokens?.find((token) => {
        return token.symbol === tokenSymbol;
      });
      setSelectedTokenSymbol(token?.symbol ?? '');

      return token;
    }, [possibleTokens, tokenSymbol]);

    const amountInSelectedToken = useMemo(() => {
      if (!sender.tokensToSend || !selectedToken?.symbol) {
        return;
      }

      const decimals =
        CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
          return token.symbol === selectedTokenSymbol;
        })?.decimals ?? 1;

      return applyDecimalsToNumericString(
        sender.tokensToSend.toString(),
        decimals,
      );
    }, [
      chainId,
      selectedTokenSymbol,
      sender.tokensToSend,
      selectedToken?.symbol,
    ]);

    const onSubmit: SubmitHandler<FormPayload> = useCallback(
      async (payload) => {
        setSubmitError(null); // Clear any previous error when retrying

        if (!isConnected) {
          if (activeTab === 'token') {
            setPendingFormSubmission(true);
          }
          openConnectModal?.();
          return;
        }

        // Clear pending submission since we're now connected
        setPendingFormSubmission(false);

        if (
          !walletClient ||
          !creatorInfo.address.data ||
          !creatorInfo.address.isValid
        ) {
          setSubmitError('Invalid wallet or address');
          return;
        }

        try {
          await linkWalletIfNeeded();
        } catch (error) {
          console.error('Error linking wallet', error);
          if (!submitError) {
            setSubmitError('Unknown error linking wallet.');
          }
          return;
        }

        const { chainId: formChainId, tokenSymbol, type, ...rest } = payload;

        const chainId =
          type === 'token'
            ? formChainId
            : (selectedCollectible?.chainId ?? formChainId);

        const tokenAddress =
          type === 'token'
            ? (CHAIN_ID_TO_TOKENS[chainId]?.find((t) => {
                return t.symbol === tokenSymbol;
              })?.address ?? EMPTY_HEX)
            : EMPTY_HEX;

        rest.message = ' ' + rest.message;

        // Set the amount based on active tab for the SendPayload
        const finalAmount =
          activeTab === 'token'
            ? payload.tokenAmount
            : payload.collectibleAmount;

        const sendPayload: SendPayload = {
          ...rest,
          amount: finalAmount, // Use the derived amount
          chainId,
          tokenAddress,
          type,
        };

        try {
          await sender.send({
            sendPayload,
            recipientAddress: creatorInfo.address.data,
          });
        } catch (error) {
          setSubmitError('Unknown error sending transaction.');
          console.error('Unknown error sending transaction.', error);
        }
      },
      [
        sender,
        walletClient,
        creatorInfo.address.data,
        creatorInfo.address.isValid,
        isConnected,
        openConnectModal,
        linkWalletIfNeeded,
        selectedCollectible,
        activeTab,
        submitError,
      ],
    );

    // Watch for connection changes to open collectible modal
    useEffect(() => {
      if (isConnected && pendingCollectibleModal) {
        setIsCollectibleModalOpen(true);
        setPendingCollectibleModal(false);
      }

      const savedChoice = localStorage.getItem('donate-option-choice');

      // Handle pending form submission after connection
      if (isConnected && pendingFormSubmission && walletClient) {
        if (savedChoice === 'account' && donor) {
          void formMethods.handleSubmit(onSubmit)();
          setPendingFormSubmission(false);
        } else if (savedChoice === 'guest' || !savedChoice) {
          void formMethods.handleSubmit(onSubmit)();
          setPendingFormSubmission(false);
        }
      }
    }, [
      isConnected,
      pendingCollectibleModal,
      pendingFormSubmission,
      formMethods,
      walletClient,
      donor,
      onSubmit,
    ]);

    if (!creatorInfo.address.isValid && !creatorInfo.address.isFetching) {
      return <DonateFormWrongAddress className={className} />;
    }

    if (sender.isSending) {
      return (
        <DonateFormLoading
          className={className}
          activeTab={activeTab}
          selectedCollectible={selectedCollectible}
          amount={amount}
          collectibleAmount={collectibleAmount}
          amountInSelectedToken={
            amountInSelectedToken
              ? formatTokenValue(Number(amountInSelectedToken))
              : undefined
          }
          selectedTokenSymbol={selectedToken?.symbol}
        />
      );
    }

    if (sender.isSuccess) {
      return (
        <DonateFormSuccess
          className={className}
          chainId={chainId}
          transactionHash={sender.data?.transactionHash}
          resetForm={() => {
            sender.reset();
            formMethods.reset();
            setSelectedCollectible(null);
          }}
        />
      );
    }
    return (
      <div ref={reference} className={classes(baseClassName, className)}>
        <link rel="preload" as="image" href={backgroundLines3.src} />
        <img
          alt=""
          src={backgroundLines3.src}
          className="pointer-events-none absolute top-0 hidden h-full opacity-100 lg:block"
        />

        <DonateFormHeader creatorInfo={creatorInfo} />

        <DonateFormBody
          creatorInfo={creatorInfo}
          formMethods={formMethods}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          defaultTokenSymbol={defaultTokenSymbol}
          possibleTokens={possibleTokens}
          allowedChainsIds={allowedChainsIds}
          sender={sender}
          selectedTokenSymbol={selectedTokenSymbol}
          selectedCollectible={selectedCollectible}
          setSelectedCollectible={setSelectedCollectible}
          collectibleAmount={collectibleAmount}
          isConnected={isConnected}
          openConnectModal={openConnectModal}
          setPendingCollectibleModal={setPendingCollectibleModal}
          setIsCollectibleModalOpen={setIsCollectibleModalOpen}
          submitError={submitError}
          onSubmit={onSubmit}
          amount={amount}
          minimumSfxAmount={minimumSfxAmount}
        />

        <CollectibleSelectModal
          isOpen={isCollectibleModalOpen}
          onClose={() => {
            return setIsCollectibleModalOpen(false);
          }}
          collectibleSearch={collectibleSearch}
          setCollectibleSearch={setCollectibleSearch}
          showMobileFilter={showMobileFilter}
          setShowMobileFilter={setShowMobileFilter}
          collectionFilters={collectionFilters}
          setCollectionFilters={setCollectionFilters}
          formMethods={formMethods}
          setSelectedCollectible={setSelectedCollectible}
        />
      </div>
    );
  },
);
DonateForm.displayName = 'DonateForm';
