'use client';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { Toggle } from '@idriss-xyz/ui/toggle';
import { getAccessToken } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isAddress } from 'viem';

import { editCreatorProfile } from '@/app/creators/utils';
import { useAuth } from '@/app/creators/context/auth-context';
import { testDonation } from '@/app/creators/constants';

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex flex-col gap-2">
    <h5 className="pb-1 text-heading5">{title}</h5>
    <hr />
  </div>
);

const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-6">{children}</div>
);

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
  const [copiedObsLink, setCopiedObsLink] = useState(false);

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
              render={({ field }) => (
                <Toggle
                  label="Alerts"
                  sublabel="Plays a sound and shows a message when someone donates"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {alertEnabled && (
              <>
                <Controller
                  name="minimumAlertAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => (
                    <Form.Field
                      className="max-w-[360px]"
                      numeric
                      label="Minimum alert amount ($)"
                      helperText={fieldState.error?.message}
                      error={Boolean(fieldState.error?.message)}
                      {...field}
                      value={field.value?.toString()}
                    />
                  )}
                />
                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  <div className="flex max-w-[360px] flex-row">
                    <Button
                      size="medium"
                      intent="secondary"
                      prefixIconName={
                        copiedObsLink ? 'CheckCircle2' : undefined
                      }
                      onClick={() => validateAndCopy(copyObsLink)}
                      className={
                        copiedObsLink
                          ? 'border-mint-600 bg-mint-300 hover:bg-mint-300'
                          : ''
                      }
                    >
                      {copiedObsLink ? 'COPIED' : 'OBS LINK'}
                    </Button>

                    <Button
                      size="medium"
                      intent="tertiary"
                      onClick={sendTestDonation}
                    >
                      TEST ALERT
                    </Button>
                  </div>
                </div>
              </>
            )}
          </FormFieldWrapper>

          {/* TTS form fields */}
          <FormFieldWrapper>
            <SectionHeader title="Text-to-speech" />
            <Controller
              name="ttsEnabled"
              control={formMethods.control}
              render={({ field }) => (
                <Toggle
                  label="Text-to-speech"
                  sublabel="Reads the donation message aloud during the alert"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {ttsEnabled && alertEnabled && (
              <>
                <Controller
                  name="minimumTTSAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => (
                    <Form.Field
                      className="max-w-[360px]"
                      numeric
                      label="Minimum TTS amount ($)"
                      helperText={fieldState.error?.message}
                      error={Boolean(fieldState.error?.message)}
                      {...field}
                      value={field.value?.toString()}
                    />
                  )}
                />
                <Controller
                  name="customBadWords"
                  control={formMethods.control}
                  render={({ field, fieldState }) => (
                    <Form.TagField
                      label="Custom Bad Words"
                      className="max-w-[360px]"
                      helperText={fieldState.error?.message}
                      error={Boolean(fieldState.error?.message)}
                      {...field}
                    />
                  )}
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
              render={({ field }) => (
                <Toggle
                  label="AI sound effects"
                  sublabel="Replaces the default alert sound with a custom effect"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {sfxEnabled && alertEnabled && (
              <Controller
                name="minimumSfxAmount"
                control={formMethods.control}
                render={({ field, fieldState }) => (
                  <Form.Field
                    className="max-w-[360px]"
                    numeric
                    label="Minimum Sfx amount ($)"
                    helperText={fieldState.error?.message}
                    error={Boolean(fieldState.error?.message)}
                    {...field}
                    value={field.value?.toString()}
                  />
                )}
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
