'use client';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card, CardHeader } from '@idriss-xyz/ui/card';
import { Switch } from '@idriss-xyz/ui/switch';
import { classes } from '@idriss-xyz/ui/utils';
import { Form } from '@idriss-xyz/ui/form';
import { getAccessToken } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isAddress } from 'viem';

import { editCreatorProfile } from '@/app/creators/utils';
import { useAuth } from '@/app/creators/context/auth-context';
import { testDonation } from '@/app/creators/constants';

type FormPayload = {
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: string;
  alertMuted: boolean;
  ttsMuted: boolean;
  sfxMuted: boolean;
  customBadWords: string[];
};

// ts-unused-exports:disable-next-line
export default function StreamAlerts() {
  const { creator, creatorLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [copiedObsLink, setCopiedObsLink] = useState(false);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
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
  const [alertMuted] = formMethods.watch(['alertMuted']);

  const sendTestDonation = useCallback(() => {
    if (!creator?.primaryAddress || !isAddress(creator.primaryAddress)) {
      alert('Please enter a valid address first');
      return;
    }

    localStorage.setItem('testDonation', JSON.stringify(testDonation));

    // Show confirmation
    alert('Test donation sent! Check your OBS page.');
  }, [creator?.primaryAddress]);

  const copyObsLink = async () => {
    if (!creator?.primaryAddress) return;

    await navigator.clipboard.writeText(
      `${CREATORS_LINK}/obs?address=${creator.primaryAddress}`,
    );
    setCopiedObsLink(true);
  };

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

  useEffect(() => {
    setTimeout(() => {
      setCopiedObsLink(false);
    }, 3000);
  }, []);

  const onSubmit = async (data: FormPayload) => {
    setIsSaving(true);

    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        throw new Error('Could not get auth token.');
      }
      if (!creator?.name) {
        throw new Error('Creator not initialized');
      }

      const editSuccess = await editCreatorProfile(
        creator.name,
        {
          minimumAlertAmount: data.minimumAlertAmount,
          minimumTTSAmount: data.minimumTTSAmount,
          minimumSfxAmount: data.minimumSfxAmount,
          alertMuted: data.alertMuted,
          ttsMuted: data.ttsMuted,
          sfxMuted: data.sfxMuted,
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

  return (
    <Card>
      <CardHeader>Alerts</CardHeader>
      <hr />
      <Form className="w-full" onSubmit={formMethods.handleSubmit(onSubmit)}>
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
    </Card>
  );
}
