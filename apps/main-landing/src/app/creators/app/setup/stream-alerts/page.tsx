'use client';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { Toggle } from '@idriss-xyz/ui/toggle';
import { Alert } from '@idriss-xyz/ui/alert';
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
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [testDonationSuccess, setTestDonationSuccess] = useState<
    boolean | null
  >(null);

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
      setTestDonationSuccess(false);
      return;
    }

    localStorage.setItem('testDonation', JSON.stringify(testDonation));

    setTestDonationSuccess(true);
  }, [creator?.primaryAddress]);

  const handleAlertClose = useCallback(() => {
    setSaveSuccess(null);
  }, []);

  const handleTestDonationClose = useCallback(() => {
    setTestDonationSuccess(null);
  }, []);

  const onSubmit = async (data: FormPayload) => {
    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        setSaveSuccess(false);
        console.error('Could not get auth token.');
        return;
      }
      if (!creator?.name) {
        setSaveSuccess(false);
        console.error('Creator not initialized');
        return;
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
    } catch (error) {
      console.error('Error saving profile:', error);
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
              render={({ field }) => {
                return (
                  <Toggle
                    label="Text-to-speech"
                    sublabel="Reads the donation message aloud during the alert"
                    value={alertEnabled ? field.value : false}
                    disabled={!alertEnabled}
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
              render={({ field }) => {
                return (
                  <Toggle
                    label="AI sound effects"
                    sublabel="Replaces the default alert sound with a custom effect"
                    value={alertEnabled ? field.value : false}
                    disabled={!alertEnabled}
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
        </Form>
      </div>
      {/* Alerts */}
      {testDonationSuccess && (
        <Alert
          heading="Test alert sent successfully!"
          type="success"
          description="Check your stream preview to see it"
          iconName="BellRing"
          autoClose
          onClose={handleTestDonationClose}
        />
      )}
      {testDonationSuccess === false && (
        <Alert
          heading="Unable to send test alert"
          type="error"
          description="Check your streaming software and verify the link"
          iconName="BellRing"
          autoClose
          onClose={handleTestDonationClose}
        />
      )}
      {saveSuccess && (
        <Alert
          heading="Refresh the browser source in your streaming software"
          type="success"
          description="Keeps your donation alert setup up to date"
          autoClose
          onClose={handleAlertClose}
        />
      )}
      {saveSuccess === false && (
        <Alert
          heading="Unable to save settings"
          type="error"
          description="Please try again later"
          autoClose
          onClose={handleAlertClose}
        />
      )}
    </Card>
  );
}
