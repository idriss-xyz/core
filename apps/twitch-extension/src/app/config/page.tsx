'use client';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { useState } from 'react';
import { createPublicClient, http, isAddress } from 'viem';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';
import { QueryProvider } from '@idriss-xyz/main-landing/providers';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

import { ConfigSubmitStatus, FormValues } from '@/app/types';
import { backgroundLines2, backgroundLines3 } from '@/assets';

const FORM_VALUES = {
  donationLink: '',
};

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
});

// ts-unused-exports:disable-next-line
export default function Config() {
  return (
    <QueryProvider>
      <ConfigContent />
    </QueryProvider>
  );
}

// ts-unused-exports:disable-next-line
function ConfigContent() {
  const [submitStatus, setSubmitStatus] = useState<ConfigSubmitStatus>();
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: FORM_VALUES,
  });

  const onSubmit = async (payload: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const twitch = (window as any).Twitch;
    setSubmitStatus(undefined);

    if (!twitch?.ext) {
      setSubmitStatus('error');
      return;
    }

    let input: string | null = null;
    try {
      const url = new URL(payload.donationLink);
      input = url.searchParams.get('address');
    } catch {
      setSubmitStatus('error');
      return;
    }

    if (!input) {
      setSubmitStatus('error');
      return;
    }

    let address: string | null = null;
    if (isAddress(input)) {
      address = input;
    } else {
      try {
        const resolved = await publicClient.getEnsAddress({
          name: normalize(input),
        });
        if (resolved) {
          address = resolved;
        } else {
          setSubmitStatus('error');
          return;
        }
      } catch {
        setSubmitStatus('error');
        return;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    twitch.ext.configuration.set(
      'broadcaster',
      '1',
      JSON.stringify({ donationLink: payload.donationLink, address }),
    );

    reset(FORM_VALUES);
    setSubmitStatus('success');
  };

  return (
    <>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] p-2">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        <div className="relative z-1 flex w-[440px] max-w-full flex-col items-center rounded-xl bg-white">
          <link rel="preload" as="image" href={backgroundLines3.src} />
          <img
            alt=""
            src={backgroundLines3.src}
            className="pointer-events-none absolute top-0 hidden h-full opacity-100 lg:block"
          />

          <h1 className="self-start px-5 pt-5 text-heading4">
            Set up your extension
          </h1>

          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full px-5 pb-5 pt-6"
          >
            <Controller
              control={control}
              name="donationLink"
              rules={{
                required: 'Donation link is required.',
                validate: (value) => {
                  try {
                    const url = new URL(value);

                    const isValidHost = [
                      'idriss.xyz',
                      'www.idriss.xyz',
                    ].includes(url.hostname);

                    const isValidPath =
                      url.pathname.startsWith('/creators/donate');

                    if (!isValidHost || !isValidPath) {
                      return 'Donation link must be from the idriss.xyz domain.';
                    }

                    return true;
                  } catch {
                    return 'Invalid URL format.';
                  }
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Form.Field
                      {...field}
                      value={field.value}
                      label="Donation link"
                    />

                    {submitStatus === 'success' && (
                      <span
                        className={classes(
                          'flex items-center gap-x-1 pt-1 text-label7 text-mint-500 lg:text-label6',
                        )}
                      >
                        Donation link saved successfully.
                      </span>
                    )}

                    {submitStatus === 'error' && (
                      <span
                        className={classes(
                          'flex items-center gap-x-1 pt-1 text-label7 text-red-500 lg:text-label6',
                        )}
                      >
                        <Icon name="AlertCircle" size={12} className="p-px" />
                        This donation link doesn’t exist.
                      </span>
                    )}

                    {fieldState.error && (
                      <span
                        className={classes(
                          'flex items-center gap-x-1 pt-1 text-label7 text-red-500 lg:text-label6',
                        )}
                      >
                        <Icon name="AlertCircle" size={12} className="p-px" />
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                );
              }}
            />

            <Button
              type="submit"
              size="medium"
              intent="primary"
              className="mt-6 w-full"
            >
              SAVE
            </Button>
          </Form>
        </div>
      </main>

      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" />
    </>
  );
}
