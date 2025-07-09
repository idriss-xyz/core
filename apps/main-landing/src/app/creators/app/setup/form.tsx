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
import { isAddress } from 'viem';
import { Form } from '@idriss-xyz/ui/form';
import { Button } from '@idriss-xyz/ui/button';
import { Switch } from '@idriss-xyz/ui/switch';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { classes } from '@idriss-xyz/ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Multiselect, MultiselectOption } from '@idriss-xyz/ui/multiselect';
import { usePrivy } from '@privy-io/react-auth';
import { Link } from '@idriss-xyz/ui/link';

import {
  editCreatorProfile,
  getChainIdsFromShortNames,
  getChainShortNamesFromIds,
} from '../../utils';
import { TEST_DONATION_MESSAGE } from '../../constants';
import { useAuth } from '../../context/auth-context';

type FormPayload = {
  name: string;
  chainsIds: number[];
  tokensSymbols: string[];
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: string;
  alertMuted: boolean;
  ttsMuted: boolean;
  sfxMuted: boolean;
  customBadWords: string[];
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

const testDonation = {
  type: 'test' as const,
  donor: 'idriss_xyz',
  amount: Math.floor(Math.random() * 99) + 1, // Random amount between $1-100
  message: TEST_DONATION_MESSAGE,
  sfxText: null,
  avatarUrl: null,
  txnHash: '0x22f0f25140b9fe35cc01722bb5b0366dcb68bb1bcaee3415ca9f48ce4e57d972',
  token: {
    amount: 1_000_000_000_000,
    details: {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
  },
};

export function CreatorProfileForm() {
  const [copiedObsLink, setCopiedObsLink] = useState(false);
  const [copiedDonationLink, setCopiedDonationLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const { creator, creatorLoading } = useAuth();
  const { user, getAccessToken, authenticated, ready } = usePrivy();

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      name: creator?.name ?? '',
      chainsIds:
        creator?.networks && creator.networks.length > 0
          ? getChainIdsFromShortNames(creator?.networks)
          : ALL_CHAIN_IDS,
      tokensSymbols:
        creator?.tokens && creator.tokens.length > 0
          ? creator?.tokens
          : UNIQUE_ALL_TOKEN_SYMBOLS,
      minimumAlertAmount: creator?.minimumAlertAmount ?? 1,
      minimumTTSAmount: creator?.minimumTTSAmount ?? 5,
      minimumSfxAmount: creator?.minimumSfxAmount ?? 10,
      alertMuted: creator?.alertMuted ?? false,
      ttsMuted: creator?.ttsMuted ?? false,
      sfxMuted: creator?.sfxMuted ?? false,
      customBadWords: creator?.customBadWords ?? [],
    },
    mode: 'onSubmit',
  });
  const [creatorName, chainsIds, tokensSymbols, alertMuted] = formMethods.watch(
    ['name', 'chainsIds', 'tokensSymbols', 'alertMuted'],
  );

  useEffect(() => {
    if (creator) {
      formMethods.reset({
        name: creator.name ?? '',
        chainsIds:
          creator.networks && creator.networks.length > 0
            ? getChainIdsFromShortNames(creator.networks)
            : ALL_CHAIN_IDS,
        tokensSymbols:
          creator.tokens && creator.tokens.length > 0
            ? creator.tokens
            : UNIQUE_ALL_TOKEN_SYMBOLS,
        minimumAlertAmount: creator.minimumAlertAmount ?? 1,
        minimumTTSAmount: creator.minimumTTSAmount ?? 5,
        minimumSfxAmount: creator.minimumSfxAmount ?? 10,
        alertMuted: creator.alertMuted ?? false,
        ttsMuted: creator.ttsMuted ?? false,
        sfxMuted: creator.sfxMuted ?? false,
        customBadWords: creator.customBadWords ?? [],
      });
    }
  }, [creator, formMethods]);

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
    if (!creator?.primaryAddress) return;

    await navigator.clipboard.writeText(
      `${CREATORS_LINK}/obs?address=${creator.primaryAddress}`,
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
  }, [tokensSymbols, chainsIds, resetCopyState]);

  const sendTestDonation = useCallback(() => {
    if (!creator?.primaryAddress || !isAddress(creator.primaryAddress)) {
      alert('Please enter a valid address first');
      return;
    }

    localStorage.setItem('testDonation', JSON.stringify(testDonation));

    // Show confirmation
    alert('Test donation sent! Check your OBS page.');
  }, [creator?.primaryAddress]);

  const onSubmit = async (data: FormPayload) => {
    setIsSaving(true);

    const chainsShortNames = getChainShortNamesFromIds(data.chainsIds);

    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        throw new Error('Could not get auth token.');
      }
      const editSuccess = await editCreatorProfile(
        data.name,
        {
          minimumAlertAmount: data.minimumAlertAmount,
          minimumTTSAmount: data.minimumTTSAmount,
          minimumSfxAmount: data.minimumSfxAmount,
          alertMuted: data.alertMuted,
          ttsMuted: data.ttsMuted,
          sfxMuted: data.sfxMuted,
          networks: chainsShortNames,
          tokens: data.tokensSymbols,
          customBadWords: data.customBadWords,
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

  // While Privy is loading, or we are authenticated and waiting for creator (before timeout)
  if (!ready || creatorLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // After loading/timeout, if still no auth or creator, show error.
  if (!authenticated || !creator || !user) {
    return (
      <div className="flex h-40 flex-col items-center justify-center">
        <p className="text-lg font-bold text-red-500">Creator not signed in</p>
        <Link href="/creators" size="m">
          Go back to creators
        </Link>
      </div>
    );
  }

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

      <div className="mt-6 w-full">
        <label className="text-sm font-medium text-neutral-900">
          Wallet address
        </label>
        <p className="mt-1 w-full truncate rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-600">
          {creator.primaryAddress}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          This address is linked to your account and cannot be changed.
        </p>
      </div>

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
        name="customBadWords"
        control={formMethods.control}
        render={({ field, fieldState }) => {
          return (
            <Form.TagField
              label="Custom Bad Words"
              className="mt-6 w-full"
              helperText={fieldState.error?.message}
              error={Boolean(fieldState.error?.message)}
              {...field}
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
