'use client';
import Image from 'next/image';
import { Form } from '@idriss-xyz/ui/form';
import { Button } from '@idriss-xyz/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Multiselect, MultiselectOption } from '@idriss-xyz/ui/multiselect';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';

import {
  CHAIN,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
} from './donate/constants';
import { Providers } from './providers';
import { ChainToken, TokenSymbol } from './donate/types';

type FormPayload = {
  address: string;
  tokensSymbols: string[];
  chainsIds: number[];
};

const ALL_CHAIN_IDS = Object.values(CHAIN).map((chain) => {
  return chain.id;
});
const ALL_TOKEN_SYMBOLS = Object.values(CHAIN_ID_TO_TOKENS)
  .flat()
  .map((token) => {
    return token.symbol;
  });
const UNIQUE_ALL_TOKEN_SYMBOLS = [
  ...new Map(
    ALL_TOKEN_SYMBOLS.map((symbol) => {
      return [symbol, symbol];
    }),
  ).values(),
];

const TOKENS_ORDER: Record<TokenSymbol, number> = {
  ETH: 1,
  USDC: 2,
  DAI: 3,
  GHST: 4,
  PRIME: 5,
  YGG: 6,
  PDT: 7,
  DEGEN: 8,
};

// ts-unused-exports:disable-next-line
export default function Donors() {
  const [copiedDonationLink, setCopiedDonationLink] = useState(false);
  const [copiedObsLink, setCopiedObsLink] = useState(false);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      address: '',
      chainsIds: ALL_CHAIN_IDS,
      tokensSymbols: UNIQUE_ALL_TOKEN_SYMBOLS,
    },
    mode: 'onChange',
  });
  const [chainsIds, tokensSymbols, address] = formMethods.watch([
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
    return new Map(
      selectedChainsTokens.map((token) => {
        return [token.symbol, token];
      }),
    )
      .values()
      .map((token) => {
        return {
          label: token.name,
          value: token.symbol,
          icon: (
            <Image
              width={24}
              height={24}
              src={token.logo}
              className="size-6 rounded-full"
              alt={token.symbol}
            />
          ),
        };
      })
      .toArray()
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
          <Image
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

  const validateAndCopy = async (copyFunction: () => Promise<void>) => {
    const isValid = await formMethods.trigger();
    if (isValid) {
      await copyFunction();
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

    await navigator.clipboard.writeText(
      `https://www.idriss.xyz/creators/donate?address=${address}&token=${tokensSymbols.join(',')}&network=${chainsShortNames.join(',')}`,
    );

    setCopiedDonationLink(true);
    setCopiedObsLink(false);
  };
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const copyObsLink = async () => {
    await navigator.clipboard.writeText(
      `https://api.idriss.xyz/creators/obs?address=${address}`,
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

  return (
    <Providers>
      <TopBar />
      <main className="flex grow items-start justify-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pt-[56px] lg:px-0">
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="container flex w-[440px] max-w-full flex-col items-center rounded-xl bg-white px-4 pb-3 pt-6 lg:mt-[108px]">
          <h1 className="self-start text-heading4">
            Create your donation links
          </h1>
          <div className="w-full">
            <Form className="w-full">
              <Controller
                control={formMethods.control}
                name="address"
                rules={{
                  required: 'Address is required',
                  pattern: {
                    value: /^0x/,
                    message: 'Address must start with 0x',
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
                control={formMethods.control}
                name="chainsIds"
                rules={{
                  required: 'Select at least one network',
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <Multiselect<number>
                        inputClassName="mt-6 w-full"
                        label="Network"
                        options={allowedChainOptions}
                        onChange={(value) => {
                          onChangeChainId();
                          field.onChange(value);
                        }}
                        value={field.value}
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                      />
                    </>
                  );
                }}
              />

              <Controller
                control={formMethods.control}
                name="tokensSymbols"
                rules={{
                  required: 'Select at least one token',
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Multiselect<string>
                      inputClassName="mt-6 w-full"
                      label="Token"
                      options={uniqueTokenOptions}
                      onChange={field.onChange}
                      value={field.value}
                      helperText={fieldState.error?.message}
                      error={Boolean(fieldState.error?.message)}
                    />
                  );
                }}
              />
              <div className="mt-6 grid grid-cols-2 gap-2 lg:gap-4">
                <Button
                  intent="primary"
                  size="medium"
                  prefixIconName={
                    copiedDonationLink ? 'CheckCircle2' : undefined
                  }
                  className={classes(
                    'w-full',
                    copiedDonationLink &&
                      'bg-mint-600 hover:bg-mint-600 [&>div]:hidden',
                  )}
                  onClick={() => {
                    return validateAndCopy(copyDonationLink);
                  }}
                >
                  {copiedDonationLink ? 'COPIED' : 'DONATION LINK'}
                </Button>

                <Button
                  intent="secondary"
                  size="medium"
                  prefixIconName={copiedObsLink ? 'CheckCircle2' : undefined}
                  className={classes(
                    'w-full',
                    copiedObsLink &&
                      'border-mint-600 bg-mint-300 hover:bg-mint-300',
                  )}
                  onClick={() => {
                    return validateAndCopy(copyObsLink);
                  }}
                >
                  {copiedObsLink ? 'COPIED' : 'OBS LINK'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </Providers>
  );
}
