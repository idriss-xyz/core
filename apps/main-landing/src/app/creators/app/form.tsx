/* eslint-disable @next/next/no-img-element */
'use client';
import {
  CHAIN,
  ChainToken,
  TokenSymbol,
  CREATORS_LINK,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
} from '@idriss-xyz/constants';
import { Hex, isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { Form } from '@idriss-xyz/ui/form';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Multiselect, MultiselectOption } from '@idriss-xyz/ui/multiselect';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

import { ethereumClient } from '../donate/config';
import { getCreatorProfile, editCreatorProfile } from '../utils';

type FormPayload = {
  name: string;
  address: string;
  chainsIds: number[];
  tokensSymbols: string[];
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voice_id: string;
  voice_muted: boolean;
};

const ALL_CHAIN_IDS = Object.values(CHAIN).map((chain) => {
  return chain.id;
});

const ALL_TOKEN_SYMBOLS = Object.values(CHAIN_ID_TO_TOKENS)
  .flat()
  .map((token) => {
    return token.symbol;
  });

const UNIQUE_ALL_TOKEN_SYMBOLS = [...new Set(ALL_TOKEN_SYMBOLS)];

const TOKENS_ORDER: Record<TokenSymbol, number> = {
  IDRISS: 1,
  ETH: 2,
  USDC: 3,
  DAI: 4,
  GHST: 5,
  PRIME: 6,
  YGG: 7,
  RON: 8,
  AXS: 9,
  PDT: 10,
  DEGEN: 11,
  PENGU: 12,
};

export function CreatorProfileForm() {
  const [copiedObsLink, setCopiedObsLink] = useState(false);
  const [copiedDonationLink, setCopiedDonationLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user } = useDynamicContext();
  const initialName = user?.verifiedCredentials.find((credential) => {return credential.oauthProvider === 'twitch'})?.oauthDisplayName;

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      name: initialName ?? '',
      address: '',
      chainsIds: ALL_CHAIN_IDS,
      tokensSymbols: UNIQUE_ALL_TOKEN_SYMBOLS,
      minimumAlertAmount: 0,
      minimumTTSAmount: 0,
      minimumSfxAmount: 0,
    },
    mode: 'onSubmit',
  });
  const [creatorName, chainsIds, tokensSymbols, address] = formMethods.watch([
    'name',
    'chainsIds',
    'tokensSymbols',
    'address',
  ]);

  const selectedChainsTokens: ChainToken[] = useMemo(() => {
    return chainsIds
      .flatMap((chainId) => {
        return CHAIN_ID_TO_TOKENS[chainId] as ChainToken | undefined;
      })
      .filter((token) => {
        return token !== undefined;
      });
  }, [chainsIds]);

  const uniqueTokenOptions: MultiselectOption<string>[] = useMemo(() => {
    if (!selectedChainsTokens) {
      return [];
    }

    const uniqueSymbols = new Set<string>();
    const uniqueTokens = selectedChainsTokens.filter((token) => {
      if (uniqueSymbols.has(token.symbol)) {
        return false;
      }

      uniqueSymbols.add(token.symbol);

      return true;
    });

    return uniqueTokens
      .map((token) => {
        return {
          label: token.name,
          value: token.symbol,
          icon: (
            <img
              width={24}
              height={24}
              src={token.logo}
              className="size-6 rounded-full"
              alt={token.symbol}
            />
          ),
        };
      })
      .sort((a, b) => {
        return (
          (TOKENS_ORDER[a.value as TokenSymbol] ?? 0) -
          (TOKENS_ORDER[b.value as TokenSymbol] ?? 0)
        );
      });
  }, [selectedChainsTokens]);

  const allowedChainOptions: MultiselectOption<number>[] = useMemo(() => {
    return DEFAULT_ALLOWED_CHAINS_IDS.map((chainId) => {
      const foundChain = Object.values(CHAIN).find((chain) => {
        return chain.id === chainId;
      });

      if (!foundChain) {
        throw new Error(`${chainId} not found`);
      }

      return {
        label: foundChain.name,
        value: foundChain.id,
        icon: (
          <img
            width={24}
            height={24}
            src={foundChain.logo}
            className="size-6 rounded-full"
            alt={foundChain.name}
          />
        ),
      };
    });
  }, []);

  const onChangeChainId = useCallback(() => {
    formMethods.setValue(
      'tokensSymbols',
      tokensSymbols.filter((symbol) => {
        return selectedChainsTokens.some((option) => {
          return option.symbol === symbol;
        });
      }),
    );
  }, [formMethods, tokensSymbols, selectedChainsTokens]);

  useEffect(() => {
    const currentTokensSymbols = formMethods.getValues('tokensSymbols');

    const updatedTokens = currentTokensSymbols.filter((symbol) => {
      return chainsIds.some((chainId) => {
        return CHAIN_ID_TO_TOKENS[chainId]?.some((token) => {
          return token.symbol === symbol;
        });
      });
    });

    if (updatedTokens.length !== currentTokensSymbols.length) {
      formMethods.setValue('tokensSymbols', updatedTokens);
    }
  }, [chainsIds, formMethods]);

  const validateAndCopy = async (copyFunction: () => Promise<void>) => {
    const isValid = await formMethods.trigger();

    if (isValid) {
      // iOS is strict about gestures, and will throw NotAllowedError with async validation (e.g. API calls)
      // setTimeout works here because it executes code in a subsequent event loop tick.
      // This "trick" helps iOS associate the clipboard operation with the earlier gesture,
      // as long as the user gesture initiates the chain of events
      setTimeout(() => {
        void copyFunction();
      }, 0);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const copyDonationLink = async () => {
    const chainsShortNames = chainsIds
      //eslint-disable-next-line unicorn/no-array-reduce
      .reduce((previous, chainId) => {
        return [
          ...previous,
          Object.values(CHAIN).find((chain) => {
            return chain.id === chainId;
          })?.shortName ?? '',
        ];
      }, [] as string[])
      .filter(Boolean);

    const donationURL = `https://www.idrissxyz./creators/${creatorName}`;

    await navigator.clipboard.writeText(donationURL);

    try {
      await fetch('https://api.idriss.xyz/creators/links', {
        method: 'POST',
        body: JSON.stringify({ donationURL }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      console.warn('Error saving creator link.');
    }

    setCopiedDonationLink(true);
    setCopiedObsLink(false);
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const copyObsLink = async () => {
    await navigator.clipboard.writeText(
      `${CREATORS_LINK}/obs?address=${address}`,
    );

    setCopiedDonationLink(false);
    setCopiedObsLink(true);
  };

  const resetCopyState = useCallback(() => {
    setCopiedObsLink(false);
    setCopiedDonationLink(false);
  }, []);

  useEffect(() => {
    resetCopyState();
  }, [address, tokensSymbols, chainsIds, resetCopyState]);

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (!initialName) {
        return;
      }
      const creatorProfile = await getCreatorProfile(initialName);
      if (!creatorProfile) {
        return;
      }
      formMethods.setValue('name', creatorProfile.name);
      formMethods.setValue('address', creatorProfile.primaryAddress);
      formMethods.setValue(
        'minimumAlertAmount',
        creatorProfile.minimumAlertAmount,
      );
      formMethods.setValue('minimumTTSAmount', creatorProfile.minimumTTSAmount);
      formMethods.setValue('minimumSfxAmount', creatorProfile.minimumSfxAmount);
    };
    void fetchCreatorProfile();
  }, [initialName, formMethods]);

  const onSubmit = async (data: FormPayload) => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await editCreatorProfile(data.name, {
        primaryAddress: data.address as Hex,
        minimumAlertAmount: data.minimumAlertAmount,
        minimumTTSAmount: data.minimumTTSAmount,
        minimumSfxAmount: data.minimumSfxAmount,
      });

      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (


              <Form
                className="w-full"
                onSubmit={formMethods.handleSubmit(onSubmit)}
              >
                <Controller
                  name="name"
                  control={formMethods.control}
                  rules={{
                    required: 'Name is required',
                    maxLength: {
                      value: 20,
                      message: 'Name cannot be longer than 20 characters',
                    },
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        label="Name"
                        className="mt-6 w-full"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                      />
                    );
                  }}
                />

                <Controller
                  name="address"
                  control={formMethods.control}
                  rules={{
                    required: 'Address is required',
                    validate: async (value) => {
                      try {
                        if (value.includes('.') && !value.endsWith('.')) {
                          const resolvedAddress =
                            await ethereumClient?.getEnsAddress({
                              name: normalize(value),
                            });

                          return resolvedAddress
                            ? true
                            : 'This address doesn’t exist.';
                        }

                        return isAddress(value)
                          ? true
                          : 'This address doesn’t exist.';
                      } catch {
                        return 'An unexpected error occurred. Try again.';
                      }
                    },
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        label="Wallet address"
                        className="mt-6 w-full"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                      />
                    );
                  }}
                />

                <Controller
                  name="chainsIds"
                  control={formMethods.control}
                  rules={{
                    required: 'Select at least one network',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <Multiselect<number>
                          label="Network"
                          value={field.value}
                          inputClassName="mt-6 w-full"
                          options={allowedChainOptions}
                          helperText={fieldState.error?.message}
                          error={Boolean(fieldState.error?.message)}
                          onChange={(value) => {
                            onChangeChainId();
                            field.onChange(value);
                          }}
                        />
                      </>
                    );
                  }}
                />

                <Controller
                  name="tokensSymbols"
                  control={formMethods.control}
                  rules={{
                    required: 'Select at least one token',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <Multiselect<string>
                        label="Token"
                        value={field.value}
                        onChange={field.onChange}
                        inputClassName="mt-6 w-full"
                        options={uniqueTokenOptions}
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                      />
                    );
                  }}
                />

                <Controller
                  name="minimumAlertAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        numeric
                        label="Minimum alert amount ($)"
                        className="mt-6 w-full"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                      />
                    );
                  }}
                />
                <Controller
                  name="minimumTTSAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        numeric
                        label="Minimum TTS amount ($)"
                        className="mt-6 w-full"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                      />
                    );
                  }}
                />

                <Controller
                  name="minimumSfxAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        numeric
                        label="Minimum Sfx amount ($)"
                        className="mt-6 w-full"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                      />
                    );
                  }}
                />

                <div className="mt-6 grid grid-cols-2 gap-2 lg:gap-4">
                  <Button
                    size="medium"
                    intent="primary"
                    onClick={() => {
                      return validateAndCopy(copyDonationLink);
                    }}
                    prefixIconName={
                      copiedDonationLink ? 'CheckCircle2' : undefined
                    }
                    className={classes(
                      'w-full',
                      copiedDonationLink &&
                        'bg-mint-600 hover:bg-mint-600 [&>div]:hidden',
                    )}
                  >
                    {copiedDonationLink ? 'COPIED' : 'DONATION LINK'}
                  </Button>

                  <Button
                    size="medium"
                    intent="secondary"
                    prefixIconName={copiedObsLink ? 'CheckCircle2' : undefined}
                    onClick={() => {
                      return validateAndCopy(copyObsLink);
                    }}
                    className={classes(
                      'w-full',
                      copiedObsLink &&
                        'border-mint-600 bg-mint-300 hover:bg-mint-300',
                    )}
                  >
                    {copiedObsLink ? 'COPIED' : 'OBS LINK'}
                  </Button>

                  <Button
                    size="medium"
                    intent="primary"
                    className="mt-4 w-full"
                    onClick={formMethods.handleSubmit(onSubmit)}
                  >
                    SAVE
                  </Button>

                  {/* TODO: Display modal on save success */}
                  {saveSuccess && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-mint-600">
                        Changes saved successfully!
                      </span>
                    </div>
                  )}
                </div>
              </Form>
  );
}
