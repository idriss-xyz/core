'use client';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Link } from '@idriss-xyz/ui/link';
import { PROTOCOL_FEE_USER_GUIDE_LINK } from '@idriss-xyz/constants';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { ChainSelect, TokenSelect } from './components';
import {
  CHAIN,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
  TOKEN,
} from './constants';
import { createSendPayloadSchema, hexSchema, SendPayload } from './schema';
import { getDefaultTokenForChainId, getSendFormDefaultValues } from './utils';
import { Token } from './types';

const SEARCH_PARAMETER = {
  ADDRESS: 'address',
  LEGACY_ADDRESS: 'streamerAddress',
  NETWORK: 'network',
  TOKEN: 'token',
};

type Properties = {
  className?: string;
};

const baseClassName =
  'z-1 w-[426px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6';

export const Content = ({ className }: Properties) => {
  const { wallet, openConnectionModal, isConnectionModalOpened } = useWallet();
  const searchParameters = useSearchParams();
  const addressFromParameters =
    searchParameters.get(SEARCH_PARAMETER.ADDRESS) ??
    searchParameters.get(SEARCH_PARAMETER.LEGACY_ADDRESS);
  const addressValidationResult = hexSchema.safeParse(addressFromParameters);

  const networkParameter = searchParameters.get(SEARCH_PARAMETER.NETWORK);
  const tokenParameter = searchParameters.get(SEARCH_PARAMETER.TOKEN);

  const possibleTokens: Token[] = useMemo(() => {
    const tokensSymbols = (tokenParameter ?? '').toLowerCase().split(',');
    const allPossibleTokens = Object.values(TOKEN);
    const tokens = allPossibleTokens.filter((token) => {
      return tokensSymbols.includes(token.symbol.toLowerCase());
    });

    // TODO: sort
    if (tokens.length === 0) {
      return allPossibleTokens;
    }

    return tokens;
  }, [tokenParameter]);

  const allowedChainsIds = useMemo(() => {
    const networksShortNames =
      networkParameter?.toLowerCase().split(',') ??
      Object.values(CHAIN).map((chain) => {
        return chain.shortName.toLowerCase();
      });

    const chains = Object.values(CHAIN).filter((chain) => {
      if (!networksShortNames.includes(chain.shortName.toLowerCase())) {
        return false;
      }

      const tokensForThisChain = CHAIN_ID_TO_TOKENS[chain.id];

      const chainIncludesSomeOfTheTokens = possibleTokens.some((token) => {
        return Boolean(
          tokensForThisChain?.find((chainToken) => {
            return (
              chainToken.symbol.toLowerCase() === token.symbol.toLowerCase()
            );
          }),
        );
      });

      return chainIncludesSomeOfTheTokens;
    });

    if (chains.length === 0) {
      return DEFAULT_ALLOWED_CHAINS_IDS;
    }

    // TODO: sort
    return chains.map((chain) => {
      return chain.id;
    });
  }, [possibleTokens, networkParameter]);

  const defaultChainId = allowedChainsIds[0] ?? 0;

  const defaultTokenAddress = useMemo(() => {
    const chainTokens =
      CHAIN_ID_TO_TOKENS[defaultChainId]?.filter((chainToken) => {
        return possibleTokens.some((token) => {
          return token.symbol.toLowerCase() === chainToken.symbol.toLowerCase();
        });
      }) ?? [];

    return (
      chainTokens[0]?.address ??
      CHAIN_ID_TO_TOKENS[defaultChainId]?.[0]?.address ??
      '0x'
    );
  }, [defaultChainId, possibleTokens]);

  const formMethods = useForm<SendPayload>({
    defaultValues: getSendFormDefaultValues(
      defaultChainId,
      defaultTokenAddress,
    ),
    resolver: zodResolver(createSendPayloadSchema(allowedChainsIds)),
  });

  const [chainId] = formMethods.watch(['chainId']);

  const onChangeChainId = useCallback(
    (chainId: number) => {
      formMethods.resetField('tokenAddress', {
        defaultValue: getDefaultTokenForChainId(chainId).address,
      });
    },
    [formMethods],
  );

  const allowedTokens = useMemo(() => {
    const tokensForThisChain = CHAIN_ID_TO_TOKENS[chainId] ?? [];
    const tokens = tokensForThisChain.filter((chainToken) => {
      return possibleTokens.find((token) => {
        return token.symbol === chainToken.symbol;
      });
    });
    if (tokens.length === 0) {
      return CHAIN_ID_TO_TOKENS[chainId] ?? [];
    }

    return tokens;
  }, [possibleTokens, chainId]);

  const onSubmit: SubmitHandler<SendPayload> = useCallback(() => {
    //
  }, []);

  if (addressValidationResult.error) {
    return (
      <div className={classes(baseClassName, className)}>
        <h1 className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
          <Icon name="AlertCircle" size={40} /> <span>Wrong address</span>
        </h1>
      </div>
    );
  }

  return (
    <div className={classes(baseClassName, className)}>
      <h1 className="text-heading4">Select your donation details</h1>
      <Form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Controller
          control={formMethods.control}
          name="chainId"
          render={({ field }) => {
            return (
              <ChainSelect
                className="mt-6 w-full"
                label="Network"
                allowedChainsIds={allowedChainsIds}
                onChange={(value) => {
                  onChangeChainId(value);
                  field.onChange(value);
                }}
                value={field.value}
              />
            );
          }}
        />

        <Controller
          control={formMethods.control}
          name="tokenAddress"
          render={({ field }) => {
            return (
              <TokenSelect
                className="mt-4 w-full"
                label="Token"
                tokens={allowedTokens}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />

        <Controller
          control={formMethods.control}
          name="amount"
          render={({ field }) => {
            return (
              <Form.Field
                {...field}
                className="mt-6"
                value={field.value.toString()}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                label="Amount ($)"
                numeric
              />
            );
          }}
        />

        <Controller
          control={formMethods.control}
          name="message"
          render={({ field, fieldState }) => {
            return (
              <Form.Field
                {...field}
                className="mt-6"
                label="Message"
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
                asTextArea
              />
            );
          }}
        />

        {wallet ? (
          <Button
            type="submit"
            intent="primary"
            size="medium"
            className="mt-6 w-full"
          >
            SEND
          </Button>
        ) : (
          <Button
            intent="primary"
            size="medium"
            className="mt-6 w-full"
            onClick={openConnectionModal}
            loading={isConnectionModalOpened}
          >
            LOG IN
          </Button>
        )}
      </Form>

      <div className="mt-6 flex justify-center">
        <Link size="xs" href={PROTOCOL_FEE_USER_GUIDE_LINK} isExternal>
          1% supplies IDRISS’s treasury
        </Link>
      </div>
    </div>
  );
};
