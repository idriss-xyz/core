/* eslint-disable @next/next/no-img-element */
'use client';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Link } from '@idriss-xyz/ui/link';
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

import { backgroundLines3 } from '@/assets';

import {
  FormPayload,
  SendPayload,
  createFormPayloadSchema,
} from '../../schema';
import { getSendFormDefaultValues } from '../../utils';
import { useSender } from '../../hooks';
import { CreatorProfile } from '../../types';

import { ChainSelect, TokenSelect } from './components';

type Properties = {
  className?: string;
  creatorInfo: CreatorProfile;
  isLegacyLink: boolean;
};

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center relative';

export const DonateForm = forwardRef<HTMLDivElement, Properties>(
  ({ className, creatorInfo, isLegacyLink }, reference) => {
    const { isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const { connectModalOpen, openConnectModal } = useConnectModal();
    const [selectedTokenSymbol, setSelectedTokenSymbol] =
      useState<string>('ETH');
    const [imageError, setImageError] = useState(false);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultChainId, selectedTokenSymbol, reset]);

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

    const sender = useSender({
      walletClient,
      callbackOnSend: sendDonationEffects,
    });

    // Reset SFX when amount falls below the minimum
    useEffect(() => {
      if (amount < minimumSfxAmount && sfx) {
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
        if (
          !walletClient ||
          !creatorInfo.address.data ||
          !creatorInfo.address.isValid
        ) {
          return;
        }

        const { chainId, tokenSymbol, ...rest } = payload;

        rest.message = ' ' + rest.message;

        const address =
          CHAIN_ID_TO_TOKENS[chainId]?.find((token: Token) => {
            return token.symbol === tokenSymbol;
          })?.address ?? EMPTY_HEX;

        const sendPayload: SendPayload = {
          ...rest,
          chainId,
          tokenAddress: address,
        };

        try {
          await sender.send({
            sendPayload,
            recipientAddress: creatorInfo.address.data,
          });
        } catch (error) {
          console.error('Unknown error sending transaction.', error);
        }
      },
      [
        sender,
        walletClient,
        creatorInfo.address.data,
        creatorInfo.address.isValid,
      ],
    );

    const sendDonation = useCallback(async () => {
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

    useEffect(() => {
      if (sender.isSuccess) {
        void sendDonation();
      }
    }, [sender.isSuccess, sender.data, sendDonation]);

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
                Sending <span className="text-mint-600">${amount}</span>{' '}
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

        <h1 className="self-start text-heading4">
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

        <Form onSubmit={formMethods.handleSubmit(onSubmit)} className="w-full">
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
                    value={field.value.toString()}
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
                      Not enough {selectedTokenSymbol} in your wallet. Add funds
                      to continue.
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
                  value={field.value}
                  className="mt-6 w-full"
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

          {(isLegacyLink || creatorInfo.alertEnabled) && (
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
                            (isLegacyLink || creatorInfo.ttsEnabled) && (
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

          {(isLegacyLink || creatorInfo.sfxEnabled) && (
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
                          (isLegacyLink || creatorInfo.sfxEnabled) && (
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
                    placeholder={amount < minimumSfxAmount ? '🔒' : undefined}
                    placeholderTooltip={`This feature unlocks for donations of $${minimumSfxAmount} or more`}
                    disabled={amount < minimumSfxAmount}
                  />
                );
              }}
            />
          )}

          {isConnected ? (
            <Button
              size="medium"
              type="submit"
              intent="primary"
              className="mt-6 w-full"
              prefixIconName="Coins"
            >
              Donate
            </Button>
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
        </Form>
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
      </div>
    );
  },
);
DonateForm.displayName = 'DonateForm';
