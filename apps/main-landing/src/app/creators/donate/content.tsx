'use client';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Link } from '@idriss-xyz/ui/link';
import { CREATORS_USER_GUIDE_LINK } from '@idriss-xyz/constants';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { getAddress } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import Image from 'next/image';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

import { backgroundLines3 } from '@/assets';

import { ChainSelect, TokenSelect } from './components';
import {
  CHAIN,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
  TOKEN,
} from './constants';
import { createSendPayloadSchema, hexSchema, SendPayload } from './schema';
import {
  applyDecimalsToNumericString,
  getDefaultTokenForChainId,
  getSendFormDefaultValues,
  getTransactionUrl,
  roundToSignificantFigures,
} from './utils';
import { Token } from './types';
import { useSender } from './hooks';

const SEARCH_PARAMETER = {
  CREATOR_NAME: 'creatorName',
  ADDRESS: 'address',
  LEGACY_ADDRESS: 'streamerAddress',
  NETWORK: 'network',
  TOKEN: 'token',
};

type Properties = {
  className?: string;
};

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center relative';

export const Content = ({ className }: Properties) => {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { connectModalOpen, openConnectModal } = useConnectModal();

  const searchParameters = useSearchParams();
  const addressFromParameters =
    searchParameters.get(SEARCH_PARAMETER.ADDRESS) ??
    searchParameters.get(SEARCH_PARAMETER.LEGACY_ADDRESS);
  const addressValidationResult = hexSchema.safeParse(addressFromParameters);

  const networkParameter = searchParameters.get(SEARCH_PARAMETER.NETWORK);
  const tokenParameter = searchParameters.get(SEARCH_PARAMETER.TOKEN);
  const creatorNameParameter = searchParameters.get(
    SEARCH_PARAMETER.CREATOR_NAME,
  );

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

  const [chainId, tokenAddress, amount] = formMethods.watch([
    'chainId',
    'tokenAddress',
    'amount',
  ]);

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

  const sender = useSender({ walletClient, publicClient });

  const selectedToken = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
      return token.address === tokenAddress;
    });
  }, [chainId, tokenAddress]);

  const amountInSelectedToken = useMemo(() => {
    if (!sender.tokensToSend || !selectedToken?.decimals) {
      return;
    }

    return applyDecimalsToNumericString(
      sender.tokensToSend.toString(),
      selectedToken.decimals,
    );
  }, [selectedToken?.decimals, sender.tokensToSend]);

  const onSubmit: SubmitHandler<SendPayload> = useCallback(
    async (sendPayload) => {
      if (!addressValidationResult.success) {
        return;
      }
      const validAddress = getAddress(addressValidationResult.data);
      // TODO: Add error handling
      await sender.send({
        sendPayload,
        recipientAddress: validAddress,
      });
    },
    [addressValidationResult.data, addressValidationResult.success, sender],
  );

  if (addressValidationResult.error) {
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
        <Spinner className="size-16 text-mint-600" />
        <p className="mt-6 text-heading5 text-neutral-900 lg:text-heading4">
          Waiting for confirmation
        </p>
        <p className="mt-3 flex flex-wrap justify-center gap-1 text-body5 text-neutral-600 lg:text-body4">
          Sending <span className="text-mint-600">${amount}</span>{' '}
          {amountInSelectedToken
            ? `(${roundToSignificantFigures(Number(amountInSelectedToken), 2)} ${selectedToken?.symbol})`
            : null}
        </p>
        <p className="mt-1 text-body5 text-neutral-600 lg:text-body4">
          Confirm transfer in your wallet
        </p>
      </div>
    );
  }

  if (sender.isSuccess) {
    const transactionUrl = getTransactionUrl({
      chainId,
      transactionHash: sender.data?.transactionHash ?? '0x',
    });

    return (
      <div className={classes(baseClassName, className)}>
        <div className="rounded-[100%] bg-mint-200 p-4">
          <Icon
            name="CheckCircle2"
            className="stroke-1 text-mint-600"
            size={48}
          />
        </div>
        <p className="text-heading4 text-neutral-900">Transfer completed</p>
        <Link
          size="medium"
          href={transactionUrl}
          className="mt-2 flex items-center"
          isExternal
        >
          View on explorer
        </Link>
        <Button
          className="mt-6 w-full"
          intent="negative"
          size="medium"
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
    <div className={classes(baseClassName, className)}>
      <Image
        priority
        src={backgroundLines3}
        className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
        alt=""
      />
      <h1 className="self-start text-heading4">
        {creatorNameParameter
          ? `Donate to ${creatorNameParameter}`
          : 'Select your donation details'}
      </h1>
      <Form onSubmit={formMethods.handleSubmit(onSubmit)} className="w-full">
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

        {isConnected ? (
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
            onClick={openConnectModal}
            loading={connectModalOpen}
          >
            LOG IN
          </Button>
        )}
      </Form>

      <div className="mt-6 flex justify-center">
        <Link size="xs" href={CREATORS_USER_GUIDE_LINK} isExternal>
          1% supplies IDRISS’s treasury
        </Link>
      </div>
    </div>
  );
};
