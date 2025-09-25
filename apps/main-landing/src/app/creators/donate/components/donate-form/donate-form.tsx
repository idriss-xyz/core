/* eslint-disable @next/next/no-img-element */
'use client';
import { Tabs } from '@idriss-xyz/ui/tabs';
import { Modal } from '@idriss-xyz/ui/modal';
import { Input } from '@idriss-xyz/ui/input';
import { Form } from '@idriss-xyz/ui/form';
import {
  Controller,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Link } from '@idriss-xyz/ui/link';
import { SiweMessage } from 'siwe';
import {
  getTransactionUrl,
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
  CREATOR_API_URL,
  TERMS_OF_SERVICE_LINK,
  PRIVACY_POLICY_LINK,
} from '@idriss-xyz/constants';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { TxLoadingContent } from '@idriss-xyz/ui/tx-loading-modal';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { getAddress } from 'viem';
import { getAccessToken } from '@privy-io/react-auth';
import { IconButton } from '@idriss-xyz/ui/icon-button';

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
import { Collectible, CreatorProfile } from '../../types';
import { SenderReturnType } from '../../hooks/use-sender';

import {
  ChainSelect,
  CollectibleGallery,
  LayersBadge,
  TokenSelect,
} from './components';

const SelectCollectibleButton = ({
  isConnected,
  openConnectModal,
  setIsCollectibleModalOpen,
}: {
  isConnected: boolean;
  openConnectModal?: () => void;
  setIsCollectibleModalOpen: (open: boolean) => void;
}) => {
  return (
    <div
      className="group flex cursor-pointer flex-col items-center justify-center gap-[10px] rounded-2xl border border-neutral-300 bg-neutral-100 px-12 py-6 hover:border-mint-600"
      onClick={() => {
        if (!isConnected) {
          openConnectModal?.();
          return;
        }
        return setIsCollectibleModalOpen(true);
      }}
    >
      <IconButton
        intent="tertiary"
        size="medium"
        iconName="Card"
        iconClassName="size-6 group-hover:text-mint-600"
        className="size-12 rounded-xl border border-neutral-200 bg-white"
      />
      <span className="text-label5 text-neutral-900 group-hover:text-mint-600">
        Select a collectible
      </span>
    </div>
  );
};

const TokenTabContent = ({
  formMethods,
  defaultTokenSymbol,
  possibleTokens,
  allowedChainsIds,
  sender,
  selectedTokenSymbol,
  activeTab,
}: {
  formMethods: UseFormReturn<FormPayload, undefined>;
  defaultTokenSymbol: string;
  possibleTokens: Token[];
  allowedChainsIds: number[];
  sender: SenderReturnType;
  selectedTokenSymbol: string;
  activeTab: string;
}) => {
  return (
    <div>
      <Controller
        name="amount"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <>
              <Form.Field
                numeric
                {...field}
                className="mt-6"
                label="Amount"
                value={field.value?.toString() ?? ''}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                prefixElement={<span>$</span>}
              />

              {!sender.haveEnoughBalance && (
                <span
                  className={classes(
                    'flex items-center gap-x-1 pt-1 text-label7 text-red-500 lg:text-label6',
                  )}
                >
                  <Icon name="AlertCircle" size={12} className="p-px" />
                  {activeTab === 'collectible'
                    ? 'You do not own this collectible.'
                    : `Not enough ${selectedTokenSymbol} in your wallet. Add funds to continue.`}
                </span>
              )}
            </>
          );
        }}
      />
      <Controller
        name="tokenSymbol"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <TokenSelect
              label="Token"
              value={field.value ?? defaultTokenSymbol}
              className="mt-4 w-full"
              tokens={possibleTokens}
              onChange={field.onChange}
            />
          );
        }}
      />
      <Controller
        name="chainId"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <ChainSelect
              label="Network"
              value={field.value}
              className="mt-4 w-full"
              onChange={field.onChange}
              allowedChainsIds={allowedChainsIds}
            />
          );
        }}
      />
    </div>
  );
};

const CollectibleTabContent = ({
  selectedCollectible,
  amount,
  setSelectedCollectible,
  setIsCollectibleModalOpen,
  isConnected,
  openConnectModal,
}: {
  selectedCollectible: Collectible | null;
  amount: number | undefined;
  setSelectedCollectible: (collectible: Collectible | null) => void;
  setIsCollectibleModalOpen: (open: boolean) => void;
  isConnected: boolean;
  openConnectModal?: () => void;
}) => {
  return (
    <div className="mt-4">
      {selectedCollectible && (
        <div className="mb-4 flex gap-2.5 rounded-[12px] border border-neutral-200 p-2">
          <img
            src={selectedCollectible.image}
            alt={selectedCollectible.name}
            className="h-[88px] w-[72px] rounded-[12px] border-neutral-300 object-cover"
          />
          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="flex flex-col gap-[6px]">
              <span className="text-label4 text-neutral-900">
                {selectedCollectible.name}
              </span>
              <span className="text-body5 text-neutral-500">
                {selectedCollectible.collection}
              </span>
              <div className="h-4.5">
                <LayersBadge amount={amount?.toString() ?? '1'} />
              </div>
            </div>
          </div>
          <div className="flex w-10 items-start">
            <IconButton
              intent="tertiary"
              size="medium"
              iconName="Repeat2"
              iconClassName="size-4"
              className="rounded-xl border border-neutral-200 bg-white"
              onClick={() => {
                setSelectedCollectible(null);
                setIsCollectibleModalOpen(true);
              }}
            />
          </div>
        </div>
      )}
      {!selectedCollectible && (
        <SelectCollectibleButton
          isConnected={isConnected}
          openConnectModal={openConnectModal}
          setIsCollectibleModalOpen={setIsCollectibleModalOpen}
        />
      )}
    </div>
  );
};

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
    const { connectModalOpen, openConnectModal } = useConnectModal();
    const [selectedTokenSymbol, setSelectedTokenSymbol] =
      useState<string>('ETH');
    const [imageError, setImageError] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isCollectibleModalOpen, setIsCollectibleModalOpen] = useState(false);
    const [collectibleSearch, setCollectibleSearch] = useState('');
    const [selectedCollectible, setSelectedCollectible] =
      useState<Collectible | null>(null);
    const [activeTab, setActiveTab] = useState<'token' | 'collectible'>(
      'token',
    );
    const [collectionFilters, setCollectionFilters] = useState<string[]>([]);

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
      reset(getSendFormDefaultValues(defaultChainId, selectedTokenSymbol));

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

    const [chainId, tokenSymbol, amount, sfx] = formMethods.watch([
      'chainId',
      'tokenSymbol',
      'amount',
      'sfx',
    ]);

    const sendDonationEffects = useCallback(
      async (txHash: string) => {
        if (!sfx || !txHash) {
          return;
        }
        await fetch(`${CREATOR_API_URL}/donation-effects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sfxMessage: sfx,
            txHash: txHash,
          }),
        });
      },
      [sfx],
    );

    // Add a record to creator-address table on db (link
    // wallet address to creator)
    const linkWalletIfNeeded = useCallback(async () => {
      if (!walletClient?.account?.address) return;

      const authToken = await getAccessToken();
      const address = getAddress(walletClient.account.address);

      // 1) check
      const qs = new URLSearchParams({ address });
      const linkedResult = await fetch(`${CREATOR_API_URL}/siwe/linked?${qs}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const { linkedTo } = await linkedResult.json();
      // Wallet is already linked to another (not donor's) public account
      if (linkedTo && linkedTo !== donor?.name) {
        throw new Error('This wallet is already linked to a public account.');
      }
      // Wallet is already linked to the donor account
      else if (linkedTo) return;

      // Wallet is not linked to any account, link to current
      // 2) nonce
      const nonceResult = await fetch(`${CREATOR_API_URL}/siwe/nonce`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const { nonce } = await nonceResult.json();

      // 3) sign SIWE
      const message_ = new SiweMessage({
        domain: window.location.hostname,
        address,
        statement:
          'Sign to confirm this wallet is yours and link it to your IDRISS Creators account. This is a one-time free signature.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
      const message = message_.prepareMessage();
      const signature = await walletClient.signMessage({
        account: address,
        message,
      });

      // 4) verify
      const verifyResult = await fetch(`${CREATOR_API_URL}/siwe/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyResult.ok) throw new Error('SIWE verify failed');
    }, [walletClient, chainId, donor?.name]);

    const syncDonation = useCallback(async () => {
      if (!creatorInfo.address.data || !creatorInfo.address.isValid) {
        return;
      }
      await fetch(`${CREATOR_API_URL}/tip-history/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: creatorInfo.address.data }),
      });
    }, [creatorInfo.address.data, creatorInfo.address.isValid]);

    const callbackOnSend = useCallback(
      async (txHash: string) => {
        await sendDonationEffects(txHash);
        await syncDonation();
      },
      [sendDonationEffects, syncDonation],
    );

    const sender = useSender({
      walletClient,
      callbackOnSend,
    });

    // Reset SFX when amount falls below the minimum
    useEffect(() => {
      if (amount && amount < minimumSfxAmount && sfx) {
        formMethods.setValue('sfx', '');
      }
    }, [amount, sfx, formMethods, minimumSfxAmount]);

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
          openConnectModal?.();
          return;
        }

        if (
          !walletClient ||
          !creatorInfo.address.data ||
          !creatorInfo.address.isValid
        ) {
          setSubmitError('Invalid wallet or address');
          return;
        }
        if (donor) {
          try {
            await linkWalletIfNeeded();
          } catch {
            setSubmitError(
              'This wallet is already linked to a public account.',
            );
            return;
          }
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

        const sendPayload: SendPayload = {
          ...rest,
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
        donor,
        isConnected,
        openConnectModal,
        linkWalletIfNeeded,
        selectedCollectible,
      ],
    );

    if (!creatorInfo.address.isValid && !creatorInfo.address.isFetching) {
      return (
        <div className={classes(baseClassName, className)}>
          <h1 className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
            <Icon name="AlertCircle" size={40} /> <span>Wrong address</span>
          </h1>
        </div>
      );
    }

    if (sender.isSending) {
      return (
        <div className={classes(baseClassName, className)}>
          <TxLoadingContent
            heading={
              <>
                Sending{' '}
                <span className="text-mint-600">
                  {activeTab === 'collectible' && selectedCollectible
                    ? selectedCollectible.name
                    : amount}
                </span>{' '}
                {/* TODO: If collectible, display amount of collectibles to send here
                    1 for ERC721 and amountOfTokens for ERC1155
                */}
                {amountInSelectedToken
                  ? `(${formatTokenValue(
                      Number(amountInSelectedToken),
                    )} ${selectedToken?.symbol})`
                  : null}
              </>
            }
            confirmationMessage="Confirm transfer in your wallet"
          />
        </div>
      );
    }

    if (sender.isSuccess) {
      const transactionUrl = getTransactionUrl({
        chainId,
        transactionHash: sender.data?.transactionHash ?? EMPTY_HEX,
      });

      return (
        <div className={classes(baseClassName, className)}>
          <div className="rounded-[100%] bg-mint-200 p-4">
            <Icon
              size={48}
              name="CheckCircle2"
              className="stroke-1 text-mint-600"
            />
          </div>

          <p className="text-heading4 text-neutral-900">Transfer completed</p>

          <Link
            isExternal
            size="medium"
            href={transactionUrl}
            className="mt-2 flex items-center"
          >
            View on explorer
          </Link>

          <Button
            size="medium"
            intent="negative"
            className="mt-6 w-full"
            onClick={() => {
              sender.reset();
              formMethods.reset();
            }}
          >
            CLOSE
          </Button>
        </div>
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

        <h1 className="mb-6 self-start text-heading4">
          {creatorInfo.name
            ? `Donate to ${creatorInfo.name}`
            : 'Select your donation details'}
          {imageError || !creatorInfo.profilePictureUrl ? (
            <div className="ml-3 inline-flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
              <Icon
                size={20}
                name="CircleUserRound"
                className="text-neutral-500"
              />
            </div>
          ) : (
            <img
              src={creatorInfo.profilePictureUrl}
              key={creatorInfo.profilePictureUrl}
              className="ml-3 inline h-8 rounded-full"
              alt="profile-pic"
              onError={() => {
                return setImageError(true);
              }}
            />
          )}

          {creatorInfo.streamStatus && (
            <Badge type="danger" variant="solid" className="ml-3">
              Live
            </Badge>
          )}
        </h1>

        <Form
          onSubmit={formMethods.handleSubmit(onSubmit, (errors) => {
            console.error('Form validation errors:', errors);
          })}
          className="w-full"
        >
          <div>
            {creatorInfo.collectibleEnabled && creatorInfo.tokenEnabled ? (
              <Tabs
                onChange={(value) => {
                  formMethods.setValue(
                    'type',
                    value === 'token' ? 'token' : 'erc1155',
                  );
                  setActiveTab(value as 'token' | 'collectible');
                }}
                items={[
                  {
                    key: 'token',
                    label: 'TOKEN',
                    children: (
                      <TokenTabContent
                        formMethods={formMethods}
                        defaultTokenSymbol={defaultTokenSymbol}
                        possibleTokens={possibleTokens}
                        allowedChainsIds={allowedChainsIds}
                        sender={sender}
                        selectedTokenSymbol={selectedTokenSymbol}
                        activeTab={activeTab}
                      />
                    ),
                  },
                  {
                    key: 'collectible',
                    label: 'COLLECTIBLE',
                    children: (
                      <CollectibleTabContent
                        selectedCollectible={selectedCollectible}
                        amount={amount}
                        setSelectedCollectible={setSelectedCollectible}
                        setIsCollectibleModalOpen={setIsCollectibleModalOpen}
                        isConnected={isConnected}
                        openConnectModal={openConnectModal}
                      />
                    ),
                  },
                ]}
              />
            ) : (
              <>
                {creatorInfo.tokenEnabled && (
                  <TokenTabContent
                    formMethods={formMethods}
                    defaultTokenSymbol={defaultTokenSymbol}
                    possibleTokens={possibleTokens}
                    allowedChainsIds={allowedChainsIds}
                    sender={sender}
                    selectedTokenSymbol={selectedTokenSymbol}
                    activeTab={activeTab}
                  />
                )}
                {creatorInfo.collectibleEnabled && (
                  <CollectibleTabContent
                    selectedCollectible={selectedCollectible}
                    amount={amount}
                    setSelectedCollectible={setSelectedCollectible}
                    setIsCollectibleModalOpen={setIsCollectibleModalOpen}
                    isConnected={isConnected}
                    openConnectModal={openConnectModal}
                  />
                )}
              </>
            )}
          </div>

          {creatorInfo.alertEnabled && (
            <Controller
              name="message"
              control={formMethods.control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Form.Field
                      {...field}
                      label={
                        <div className="flex items-center gap-2">
                          <label>Message</label>
                          {creatorInfo.minimumAlertAmount > 0 && (
                            <Badge type="info" variant="subtle">
                              Alert ${creatorInfo.minimumAlertAmount}+
                            </Badge>
                          )}
                          {creatorInfo.minimumTTSAmount > 0 &&
                            creatorInfo.ttsEnabled && (
                              <Badge type="info" variant="subtle">
                                TTS ${creatorInfo.minimumTTSAmount}+
                              </Badge>
                            )}
                        </div>
                      }
                      className="mt-4"
                      helperText={fieldState.error?.message}
                      error={Boolean(fieldState.error?.message)}
                    />
                  </>
                );
              }}
            />
          )}

          {creatorInfo.sfxEnabled && (
            <Controller
              name="sfx"
              control={formMethods.control}
              render={({ field, fieldState }) => {
                return (
                  <Form.Field
                    {...field}
                    label={
                      <div className="flex items-center gap-x-1">
                        <label htmlFor="sfx">AI sound effect</label>
                        {creatorInfo.minimumSfxAmount > 0 &&
                          creatorInfo.sfxEnabled && (
                            <Badge type="info" variant="subtle">
                              SFX ${creatorInfo.minimumSfxAmount}+
                            </Badge>
                          )}
                        <TooltipProvider delayDuration={400}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Icon name="HelpCircle" size={15} />
                            </TooltipTrigger>
                            <TooltipContent className="bg-black text-left text-white">
                              <p className="text-label6">
                                Type what you want to hear. AI will turn it into
                                a sound effect <br />
                                and replace the default sound. You can{' '}
                                <a
                                  href="https://elevenlabs.io/sound-effects"
                                  className="text-mint-500 underline"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  test it
                                </a>{' '}
                                before sending.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    }
                    className="mt-4"
                    helperText={fieldState.error?.message}
                    error={Boolean(fieldState.error?.message)}
                    placeholder={
                      amount && amount < minimumSfxAmount ? '🔒' : undefined
                    }
                    placeholderTooltip={`This feature unlocks for donations of $${minimumSfxAmount} or more`}
                    disabled={amount !== undefined && amount < minimumSfxAmount}
                  />
                );
              }}
            />
          )}

          {isConnected ? (
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Button
                  size="medium"
                  type="submit"
                  intent="primary"
                  className="mt-6 w-full"
                  prefixIconName="Coins"
                  disabled={activeTab === 'collectible' && !selectedCollectible}
                >
                  Donate
                </Button>
              </TooltipTrigger>
              <TooltipContent
                hidden={
                  activeTab === 'collectible' && selectedCollectible != null
                }
                className="z-portal bg-black text-white"
                side="bottom"
              >
                <p className="text-body6">Select a collectible first</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              size="medium"
              intent="primary"
              className="mt-6 w-full"
              onClick={openConnectModal}
              loading={connectModalOpen}
            >
              LOG IN
            </Button>
          )}
          {submitError && (
            <div className="mt-1 flex items-start gap-x-1 text-label7 text-red-500 lg:text-label6">
              <Icon name="AlertCircle" size={16} className="p-px" />
              <span>{submitError}</span>
            </div>
          )}
          <div className="mt-4 w-full py-3 text-center">
            <span className="text-label7 text-neutral-500">
              By donating, you agree to the{' '}
              <ExternalLink
                className="text-mint-600 underline"
                href={TERMS_OF_SERVICE_LINK}
              >
                Terms of service
              </ExternalLink>{' '}
              and{' '}
              <ExternalLink
                className="text-mint-600 underline"
                href={PRIVACY_POLICY_LINK}
              >
                Privacy policy
              </ExternalLink>
            </span>
          </div>
        </Form>

        <Modal
          isOpened={isCollectibleModalOpen}
          onClose={() => {
            return setIsCollectibleModalOpen(false);
          }}
          header={
            <p className="truncate text-heading5 text-neutralGreen-900">
              Search collectible
            </p>
          }
          headerContainerClassName="pl-6 pt-5.5 pb-2.5"
          className="h-[550px] w-[400px] sm:w-[500px] md:w-[827px]"
        >
          <div className="p-6">
            <div className="mb-4 flex w-full gap-2">
              {/* Mobile Filter Button - only visible below md */}
              <IconButton
                intent="tertiary"
                size="small"
                iconName="Filter"
                onClick={() => {
                  return setShowMobileFilter(true);
                }}
                className="shrink-0 md:hidden"
              />
              <Input
                placeholder="Search collectibles"
                prefixIconName="Search"
                prefixIconSize={16}
                value={collectibleSearch}
                onChange={(event) => {
                  setCollectibleSearch(event.target.value);
                }}
              />
            </div>

            <CollectibleGallery
              searchQuery={collectibleSearch}
              showMobileFilter={showMobileFilter}
              setShowMobileFilter={setShowMobileFilter}
              initialSelectedCollections={collectionFilters}
              onSelectedCollectionsChange={setCollectionFilters}
              onSelect={(collectible) => {
                if (collectible.amount === 0) {
                  setSelectedCollectible(null);
                  return;
                }
                formMethods.setValue('tokenId', collectible.tokenId);
                formMethods.setValue('contract', collectible.contract);
                formMethods.setValue('type', collectible.type ?? 'erc1155');
                formMethods.setValue('amount', collectible.amount);
                setSelectedCollectible({
                  tokenId: collectible.tokenId,
                  name: collectible.name,
                  type: collectible.type,
                  collection: collectible.collection,
                  contract: collectible.contract,
                  chainId: collectible.chainId,
                  image: collectible.image,
                  balance: collectible.balance,
                });
              }}
              onConfirm={() => {
                setIsCollectibleModalOpen(false);
              }}
            />
          </div>
        </Modal>
      </div>
    );
  },
);
DonateForm.displayName = 'DonateForm';
