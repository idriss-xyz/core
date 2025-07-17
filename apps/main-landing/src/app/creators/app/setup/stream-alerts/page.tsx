'use client';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { Toggle } from '@idriss-xyz/ui/toggle';
import { getAccessToken } from '@privy-io/react-auth';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isAddress } from 'viem';

import { editCreatorProfile } from '@/app/creators/utils';
import { useAuth } from '@/app/creators/context/auth-context';
import { testDonation } from '@/app/creators/constants';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <h5 className="pb-1 text-heading5">{title}</h5>
      <hr />
    </div>
  );
};

const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-6">{children}</div>;
};

type FormPayload = {
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: string;
  alertEnabled: boolean;
  ttsEnabled: boolean;
  sfxEnabled: boolean;
  customBadWords: string[];
};

// ts-unused-exports:disable-next-line
export default function StreamAlerts() {
  const { creator, creatorLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      minimumAlertAmount: creator?.minimumAlertAmount ?? 1,
      minimumTTSAmount: creator?.minimumTTSAmount ?? 5,
      minimumSfxAmount: creator?.minimumSfxAmount ?? 10,
      alertEnabled: creator?.alertEnabled ?? false,
      ttsEnabled: creator?.ttsEnabled ?? false,
      sfxEnabled: creator?.sfxEnabled ?? false,
      customBadWords: creator?.customBadWords ?? [],
    },
    mode: 'onSubmit',
  });
  const [alertEnabled, ttsEnabled, sfxEnabled] = formMethods.watch([
    'alertEnabled',
    'ttsEnabled',
    'sfxEnabled',
  ]);

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
          alertEnabled: data.alertEnabled,
          ttsEnabled: data.ttsEnabled,
          sfxEnabled: data.sfxEnabled,
          customBadWords: data.customBadWords,
        },
        authToken,
      );

      setSaveSuccess(editSuccess);

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
      <div className="flex flex-col justify-between">
        <Form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Alerts form fields */}
          <FormFieldWrapper>
            <SectionHeader title="Alerts" />
            <Controller
              name="alertEnabled"
              control={formMethods.control}
              render={({ field }) => {
                return (
                  <Toggle
                    label="Alerts"
                    sublabel="Plays a sound and shows a message when someone donates"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />

            {alertEnabled && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="pb-1 text-label4">Overlay link</span>
                    <CopyInput
                      value={`${CREATORS_LINK}/obs/${creator?.name}`}
                    />
                    {/* TODO: Add helper text to CopyInput*/}
                    <span className="text-label6 text-neutral-600">
                      Add this as a browser source in your streaming software
                    </span>
                  </div>
                  <Button
                    size="medium"
                    intent="secondary"
                    onClick={sendTestDonation}
                    className="h-fit"
                  >
                    TEST ALERT
                  </Button>
                </div>
                <Controller
                  name="minimumAlertAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        className="max-w-[360px]"
                        numeric
                        label="Minimum amount"
                        placeholder="$1"
                        helperText={
                          fieldState.error?.message ??
                          'Donation amount that triggers an alert'
                        }
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                      />
                    );
                  }}
                />
              </>
            )}
          </FormFieldWrapper>

          {/* TTS form fields */}
          <FormFieldWrapper>
            <SectionHeader title="Text-to-speech" />
            <Controller
              name="ttsEnabled"
              control={formMethods.control}
              disabled={!alertEnabled}
              render={({ field }) => {
                return (
                  <Toggle
                    label="Text-to-speech"
                    sublabel="Reads the donation message aloud during the alert"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />

            {ttsEnabled && alertEnabled && (
              <>
                <Controller
                  name="minimumTTSAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        className="max-w-[360px]"
                        numeric
                        label="Minimum amount"
                        placeholder="$3"
                        helperText={
                          fieldState.error?.message ??
                          'Donation amount that triggers an text-to-speech alert'
                        }
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
                        className="max-w-[360px]"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                      />
                    );
                  }}
                />
              </>
            )}
          </FormFieldWrapper>

          {/* SFX form fields */}
          <FormFieldWrapper>
            <SectionHeader title="AI sound effects" />
            <Controller
              name="sfxEnabled"
              control={formMethods.control}
              disabled={!alertEnabled}
              render={({ field }) => {
                return (
                  <Toggle
                    label="AI sound effects"
                    sublabel="Replaces the default alert sound with a custom effect"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />

            {sfxEnabled && alertEnabled && (
              <Controller
                name="minimumSfxAmount"
                control={formMethods.control}
                render={({ field, fieldState }) => {
                  return (
                    <Form.Field
                      className="max-w-[360px]"
                      numeric
                      label="Minimum amount"
                      placeholder="$5"
                      helperText={
                        fieldState.error?.message ??
                        'Donation amount that triggers an AI sound effect'
                      }
                      error={Boolean(fieldState.error?.message)}
                      {...field}
                      value={field.value?.toString()}
                    />
                  );
                }}
              />
            )}
          </FormFieldWrapper>

          <Button
            size="medium"
            intent="primary"
            className="mt-4"
            onClick={formMethods.handleSubmit(onSubmit)}
          >
            SAVE SETTINGS
          </Button>

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
        </Form>
      </div>
    </Card>
  );
}
