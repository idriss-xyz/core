/* eslint-disable @next/next/no-img-element */
'use client';
import {
  CREATOR_CHAIN,
  ChainToken,
  TokenSymbol,
  CREATORS_LINK,
  ANNOUNCEMENT_LINK,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
} from '@idriss-xyz/constants';
import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { Form } from '@idriss-xyz/ui/form';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Multiselect, MultiselectOption } from '@idriss-xyz/ui/multiselect';

import { backgroundLines2, backgroundLines3 } from '@/assets';

import { Providers } from '../providers';
import { ethereumClient } from '../donate/config';
import { TopBar } from '../components/top-bar';
import { Banner } from '../components/banner/banner';

type FormPayload = {
  name: string;
  address: string;
  chainsIds: number[];
  tokensSymbols: string[];
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

// ts-unused-exports:disable-next-line
export default function Donors() {
  const [copiedObsLink, setCopiedObsLink] = useState(false);
  const [copiedDonationLink, setCopiedDonationLink] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      name: '',
      address: '',
      chainsIds: ALL_CHAIN_IDS,
      tokensSymbols: UNIQUE_ALL_TOKEN_SYMBOLS,
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
          Object.values(CREATOR_CHAIN).find((chain) => {
            return chain.id === chainId;
          })?.shortName ?? '',
        ];
      }, [] as string[])
      .filter(Boolean);

    const donationURL = `https://www.idriss.xyz/creators/donate?address=${address}&token=${tokensSymbols.join(',')}&network=${chainsShortNames.join(',')}&creatorName=${creatorName}`;

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

  const handleShowBanner = () => {
    setShowBanner(true);
  };

  const handleHideBanner = () => {
    setShowBanner(false);
  };

  useEffect(() => {
    resetCopyState();
  }, [address, tokensSymbols, chainsIds, resetCopyState]);

  return (
    <Providers>
      <TopBar />

      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        {showBanner ? (
          <Banner onBack={handleHideBanner} />
        ) : (
          <div className="mt-8 w-[440px] max-w-full overflow-hidden px-safe lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
            <div className="container relative flex w-full flex-col items-center rounded-xl bg-white px-4 pb-3 pt-6">
              <link rel="preload" as="image" href={backgroundLines3.src} />
              <img
                alt=""
                src={backgroundLines3.src}
                className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
              />

              <h1 className="self-start text-heading4">
                Create your donation link
              </h1>

              <div className="w-full">
                <Form className="w-full">
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
                      prefixIconName={
                        copiedObsLink ? 'CheckCircle2' : undefined
                      }
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
                  </div>
                </Form>
              </div>

              <Button
                intent="tertiary"
                size="small"
                className="mb-4 mt-[38px] rounded-none border-b border-b-mint-600 p-0 px-px pb-[0.5px] text-xs font-[500] text-mint-600"
                onClick={handleShowBanner}
              >
                Download a banner for your bio
              </Button>
            </div>
          </div>
        )}

        <Button
          asLink
          isExternal
          size="small"
          intent="secondary"
          prefixIconName="InfoCircle"
          href={ANNOUNCEMENT_LINK.CREATORS_DONATIONS}
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
        >
          STEP-BY-STEP GUIDE
        </Button>
      </main>
    </Providers>
  );
}
