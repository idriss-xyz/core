/* eslint-disable @next/next/no-img-element */
'use client';
import {
  CREATOR_CHAIN,
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
import { Switch } from '@idriss-xyz/ui/switch';
import { classes } from '@idriss-xyz/ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Multiselect, MultiselectOption } from '@idriss-xyz/ui/multiselect';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';

import { ethereumClient } from '../donate/config';
import {
  getCreatorProfile,
  editCreatorProfile,
  getChainIdsFromShortNames,
  getChainShortNamesFromIds,
} from '../utils';

type FormPayload = {
  name: string;
  address: string;
  chainsIds: number[];
  tokensSymbols: string[];
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: string;
  alertMuted: boolean;
  ttsMuted: boolean;
  sfxMuted: boolean;
};

const ALL_CHAIN_IDS = Object.values(CREATOR_CHAIN).map((chain) => {
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
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const { user } = useDynamicContext();
  const initialName = user?.verifiedCredentials.find((credential) => {
    // Ignore due to missing direct enum type export from @dynamic-labs/sdk-react-core
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return credential.oauthProvider === 'twitch';
  })?.oauthDisplayName;

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      name: initialName ?? '',
      address: '',
      chainsIds: ALL_CHAIN_IDS,
      tokensSymbols: UNIQUE_ALL_TOKEN_SYMBOLS,
      minimumAlertAmount: 1,
      minimumTTSAmount: 5,
      minimumSfxAmount: 10,
    },
    mode: 'onSubmit',
  });
  const [creatorName, chainsIds, tokensSymbols, address, alertMuted] =
    formMethods.watch([
      'name',
      'chainsIds',
      'tokensSymbols',
      'address',
      'alertMuted',
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
      const foundChain = Object.values(CREATOR_CHAIN).find((chain) => {
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

  // Effect to handle alertMuted changes
  useEffect(() => {
    if (alertMuted) {
      formMethods.setValue('ttsMuted', true);
      formMethods.setValue('sfxMuted', true);
    }
  }, [alertMuted, formMethods]);

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
    const donationURL = `${CREATORS_LINK}/${creatorName}`;

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
      formMethods.setValue('tokensSymbols', creatorProfile.tokens);
      formMethods.setValue(
        'chainsIds',
        getChainIdsFromShortNames(creatorProfile.networks),
      );
      formMethods.setValue('alertMuted', creatorProfile.alertMuted);
      formMethods.setValue('ttsMuted', creatorProfile.ttsMuted);
      formMethods.setValue('sfxMuted', creatorProfile.sfxMuted);
    };
    void fetchCreatorProfile();
  }, [initialName, formMethods]);

  const sendTestDonation = useCallback(() => {
    if (!address || !isAddress(address)) {
      alert('Please enter a valid address first');
      return;
    }

    // Generate a fake transaction hash
    const fakeTransactionHash = `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`;

    // Create test donation data
    const testDonation = {
      type: 'test' as const,
      donor: 'idriss_xyz',
      amount: Math.floor(Math.random() * 99) + 1, // Random amount between $1-100
      message: 'This is a test donation.',
      sfxText: null,
      avatarUrl: null,
      txnHash: fakeTransactionHash,
      token: {
        amount: 1_000_000_000_000,
        details: {
          symbol: 'ETH',
          name: 'Ethereum',
          logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        },
      },
    };

    localStorage.setItem('testDonation', JSON.stringify(testDonation));

    // Show confirmation
    alert('Test donation sent! Check your OBS page.');
  }, [address]);

  const onSubmit = async (data: FormPayload) => {
    setIsSaving(true);
    setSaveSuccess(false);

    const chainsShortNames = getChainShortNamesFromIds(data.chainsIds);

    try {
      const authToken = getAuthToken();
      const editSuccess = await editCreatorProfile(
        data.name,
        {
          primaryAddress: data.address as Hex,
          minimumAlertAmount: data.minimumAlertAmount,
          minimumTTSAmount: data.minimumTTSAmount,
          minimumSfxAmount: data.minimumSfxAmount,
          alertMuted: data.alertMuted,
          ttsMuted: data.ttsMuted,
          sfxMuted: data.sfxMuted,
          networks: chainsShortNames,
          tokens: data.tokensSymbols,
        },
        authToken,
      );

      setSaveSuccess(editSuccess);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form className="w-full" onSubmit={formMethods.handleSubmit(onSubmit)}>
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
                const resolvedAddress = await ethereumClient?.getEnsAddress({
                  name: normalize(value),
                });

                return resolvedAddress ? true : 'This address doesn’t exist.';
              }

              return isAddress(value) ? true : 'This address doesn’t exist.';
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

      <Controller
        name="alertMuted"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <div className="mt-6 flex items-center justify-between">
              <span>Mute Alerts</span>
              <Switch value={field.value} onChange={field.onChange} />
            </div>
          );
        }}
      />

      <Controller
        name="ttsMuted"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <div className="mt-6 flex items-center justify-between">
              <span>Mute TTS</span>
              <Switch
                disabled={alertMuted}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          );
        }}
      />

      <Controller
        name="sfxMuted"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <div className="mt-6 flex items-center justify-between">
              <span>Mute Sfx</span>
              <Switch
                disabled={alertMuted}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
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
          prefixIconName={copiedDonationLink ? 'CheckCircle2' : undefined}
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
            copiedObsLink && 'border-mint-600 bg-mint-300 hover:bg-mint-300',
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

        <Button
          size="medium"
          intent="tertiary"
          onClick={sendTestDonation}
          className="w-full"
        >
          TEST DONATION
        </Button>

        {/* TODO: Display modal on save loading and success */}
        {isSaving && (
          <div className="mt-4 flex items-center gap-2">Saving...</div>
        )}
        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-mint-600">Changes saved successfully!</span>
          </div>
        )}
        {saveSuccess === false && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-red-500">
              Something went wrong. Please try again.
            </span>
          </div>
        )}
      </div>
    </Form>
  );
}
