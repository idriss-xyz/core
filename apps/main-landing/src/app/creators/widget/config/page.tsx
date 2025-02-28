'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { useEffect, useState } from 'react';
import { Hex, isAddress } from 'viem';
import { EMPTY_HEX } from '@idriss-xyz/constants';

import { backgroundLines2, backgroundLines3 } from '@/assets';
import { FormValues } from '@/app/creators/widget/types';

const FORM_VALUES = {
  address: EMPTY_HEX,
};

// ts-unused-exports:disable-next-line
export default function Config() {
  const [address, setAddress] = useState<Hex | null>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: FORM_VALUES,
  });

  const onSubmit = (payload: FormValues) => {
    if (!window.Twitch?.ext || !isAddress(payload.address)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.Twitch.ext.configuration.set(
      'broadcaster',
      '1',
      JSON.stringify(payload),
    );

    reset(FORM_VALUES);
    setAddress(payload.address);
  };

  useEffect(() => {
    if (!window.Twitch?.ext) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.Twitch.ext.onAuthorized(() => {
      const storedConfig = window.Twitch.ext.configuration.broadcaster?.content;

      if (!storedConfig) {
        return;
      }

      const parsedConfig: FormValues = JSON.parse(storedConfig);
      setAddress(parsedConfig.address as Hex);
    });
  }, []);

  return (
    <>
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        <div className="relative z-1 flex w-[440px] max-w-full flex-col items-center rounded-xl bg-white px-4 pb-9 pt-6">
          <link rel="preload" as="image" href={backgroundLines3.src} />
          <img
            alt=""
            src={backgroundLines3.src}
            className="pointer-events-none absolute top-0 hidden h-full opacity-100 lg:block"
          />

          <h1 className="self-start text-heading4">Setup your extension</h1>

          <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Controller
              name="address"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <Form.Field
                      {...field}
                      className="mt-6"
                      value={field.value}
                      label="Wallet address"
                    />

                    <span className="text-label7 text-neutralGreen-700">
                      Saved: {address}
                    </span>
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
