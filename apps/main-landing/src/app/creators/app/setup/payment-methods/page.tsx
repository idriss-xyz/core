'use client';
import {
  CHAIN_ID_TO_TOKENS,
  ChainToken,
  CREATOR_CHAIN,
  DEFAULT_ALLOWED_CHAINS_IDS,
  TokenSymbol,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { Multiselect, MultiselectOption } from '@idriss-xyz/ui/multiselect';
import { Toggle } from '@idriss-xyz/ui/toggle';
import { getAccessToken } from '@privy-io/react-auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Icon, IconName } from '@idriss-xyz/ui/icon';

import {
  editCreatorProfile,
  getChainIdsFromShortNames,
  getChainShortNamesFromIds,
} from '@/app/creators/utils';
import { useAuth } from '@/app/creators/context/auth-context';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';
import { useToast } from '@/app/creators/context/toast-context';

import SkeletonSetup from '../loading';

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
  AVAX: 5,
  GUN: 6,
  PRIME: 7,
  GHST: 8,
  RON: 9,
  AXS: 10,
  YGG: 11,
  PDT: 12,
  DEGEN: 13,
  PENGU: 14,
};

const iconsForCardPaymentMethod: IconName[] = [
  'Mastercard',
  'AmericanExpress',
  'Visa',
];

const IconsRow = ({ icons }: { icons: IconName[] }) => {
  return (
    <div className="-mt-4 flex flex-row items-center gap-2">
      {icons.map((iconName, index) => {
        return (
          <div className="relative size-6" key={index}>
            <Icon name={iconName} className="size-full" />
          </div>
        );
      })}
    </div>
  );
};

// ts-unused-exports:disable-next-line
export default function PaymentMethods() {
  const { creator, creatorLoading } = useAuth();
  const { toast } = useToast();

  const [toggleCrypto, setToggleCrypto] = useState(true);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      chainsIds:
        creator?.networks && creator.networks.length > 0
          ? getChainIdsFromShortNames(creator?.networks)
          : ALL_CHAIN_IDS,
      tokensSymbols:
        creator?.tokens && creator.tokens.length > 0
          ? creator?.tokens
          : UNIQUE_ALL_TOKEN_SYMBOLS,
    },
    mode: 'onSubmit',
  });

  const [chainsIds, tokensSymbols] = formMethods.watch([
    'chainsIds',
    'tokensSymbols',
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

  const onSubmit = async (data: FormPayload) => {
    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        toast({
          type: 'error',
          heading: 'Unable to save settings',
          description: 'Please try again later',
          autoClose: true,
        });
        console.error('Could not get auth token.');
        return;
      }
      if (!creator?.name) {
        toast({
          type: 'error',
          heading: 'Unable to save settings',
          description: 'Please try again later',
          autoClose: true,
        });
        console.error('Creator not initialized');
        return;
      }

      const chainsShortNames = getChainShortNamesFromIds(data.chainsIds);

      const editSuccess = await editCreatorProfile(
        creator.name,
        {
          tokens: data.tokensSymbols,
          networks: chainsShortNames,
        },
        authToken,
      );

      if (editSuccess) {
        toast({
          type: 'success',
          heading: 'Settings saved!',
          autoClose: true,
        });
      } else {
        toast({
          type: 'error',
          heading: 'Unable to save settings',
          description: 'Please try again later',
          autoClose: true,
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        type: 'error',
        heading: 'Unable to save settings',
        description: 'Please try again later',
        autoClose: true,
      });
    }
  };

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

  // Initialize form values after fetching creator data
  useEffect(() => {
    if (creator) {
      formMethods.reset({
        chainsIds:
          creator.networks && creator.networks.length > 0
            ? getChainIdsFromShortNames(creator.networks)
            : ALL_CHAIN_IDS,
        tokensSymbols:
          creator.tokens && creator.tokens.length > 0
            ? creator.tokens
            : UNIQUE_ALL_TOKEN_SYMBOLS,
      });
    }
  }, [creator, formMethods]);

  if (creatorLoading) {
    return <SkeletonSetup />;
  }

  return (
    <Card className="size-full">
      <div className="flex flex-col gap-6">
        <Form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormFieldWrapper>
            <SectionHeader title="Select your payment methods" />
            <Toggle
              label="Crypto"
              sublabel="Get paid in Ethereum, USDC, or other popular assets. Instant, borderless, and without middlemen."
              value={toggleCrypto}
              onChange={() => {
                return setToggleCrypto((previous) => {
                  return !previous;
                });
              }}
              className="max-w-[336px]"
              switchClassname="hidden"
            />
            {/* Uncomment when we have second payment method ready */}
            {/* <IconsRow tokens={iconsForCryptoPaymentMethod} /> */}
            {toggleCrypto && (
              <div>
                <Controller
                  name="chainsIds"
                  control={formMethods.control}
                  rules={{
                    required: 'Select at least one network',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <Multiselect<number>
                        label="Network"
                        value={field.value}
                        inputClassName="max-w-[360px]"
                        options={allowedChainOptions}
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        onChange={(value) => {
                          onChangeChainId();
                          field.onChange(value);
                        }}
                      />
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
                        inputClassName="mt-6 max-w-[360px]"
                        options={uniqueTokenOptions}
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                      />
                    );
                  }}
                />
                {formMethods.formState.isDirty && (
                  <Button
                    size="medium"
                    intent="primary"
                    className="mt-4"
                    onClick={formMethods.handleSubmit(onSubmit)}
                  >
                    SAVE SETTINGS
                  </Button>
                )}
              </div>
            )}
          </FormFieldWrapper>

          <hr className="max-w-[445px]" />

          <FormFieldWrapper>
            <Toggle
              label="Card & bank transfers"
              sublabel="Get paid via credit cards or traditional bank transfers. Trusted, familiar, and widely used by fans."
              value={false}
              disabled
              comingSoon
              onChange={() => {
                console.log('Not implemented yet');
              }}
              className="max-w-[336px]"
              switchClassname="hidden"
            />
            <IconsRow icons={iconsForCardPaymentMethod} />
          </FormFieldWrapper>
        </Form>
      </div>
    </Card>
  );
}
