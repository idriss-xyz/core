'use client';
import Image from 'next/image';
import { Form } from '@idriss-xyz/ui/form';
import { Button } from '@idriss-xyz/ui/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';

import { ChainSelect, TokenSelect } from './donate/components';
import {
  CHAIN,
  CHAIN_ID_TO_TOKENS,
  DEFAULT_ALLOWED_CHAINS_IDS,
} from './donate/constants';
import { Providers } from './providers';
import { getDefaultTokenForChainId } from './donate/utils';

type FormPayload = {
  address: string;
  tokenAddress: string;
  chainId: number;
};

// ts-unused-exports:disable-next-line
export default function Donors() {
  const [copiedDonationLink, setCopiedDonationLink] = useState(false);
  const [copiedObsLink, setCopiedObsLink] = useState(false);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      address: '',
      chainId: CHAIN.ETHEREUM.id,
      tokenAddress: CHAIN_ID_TO_TOKENS[CHAIN.ETHEREUM.id][1]?.address ?? '0x',
    },
  });
  const [chainId, tokenAddress, address] = formMethods.watch([
    'chainId',
    'tokenAddress',
    'address',
  ]);

  const onChangeChainId = useCallback(
    (chainId: number) => {
      formMethods.resetField('tokenAddress', {
        defaultValue: getDefaultTokenForChainId(chainId).address,
      });
    },
    [formMethods],
  );

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const copyDonationLink = async () => {
    const chainShortName =
      Object.values(CHAIN).find((chain) => {
        return chain.id === chainId;
      })?.shortName ?? '';
    const tokenSymbol =
      CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
        return token.address === tokenAddress;
      })?.symbol ?? '';

    await navigator.clipboard.writeText(
      `https://www.idriss.xyz/creators/donate?address=${address}&token=${tokenSymbol}&network=${chainShortName}`,
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
  }, [address, tokenAddress, chainId, resetCopyState]);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onSubmit: SubmitHandler<FormPayload> = () => {
    //
  };

  return (
    <Providers>
      <TopBar />
      <main className="flex grow items-start justify-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] pt-[104px]">
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="container flex w-[426px] max-w-full flex-col items-center rounded-xl bg-white px-4 pb-3 pt-6 lg:mt-[108px]">
          <h1 className="self-start text-heading4">
            Create your donation links
          </h1>
          <div className="w-full">
            <Form
              className="w-full"
              onSubmit={formMethods.handleSubmit(onSubmit)}
            >
              <Controller
                control={formMethods.control}
                name="address"
                render={({ field }) => {
                  return (
                    <Form.Field
                      label="Wallet address"
                      className="mt-6 w-full"
                      {...field}
                    />
                  );
                }}
              />

              <Controller
                control={formMethods.control}
                name="chainId"
                render={({ field }) => {
                  return (
                    <ChainSelect
                      className="mt-6 w-full"
                      label="Network"
                      allowedChainsIds={DEFAULT_ALLOWED_CHAINS_IDS}
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
                      tokens={CHAIN_ID_TO_TOKENS[chainId] ?? []}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
              <div className="mt-6 grid grid-cols-2 gap-4">
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
                  onClick={copyDonationLink}
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
                  onClick={copyObsLink}
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
