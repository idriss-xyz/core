'use client';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Switch } from '@idriss-xyz/ui/switch';
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
      <div className="flex flex-col justify-between">
        <div className="gap-6 py-4">
          <Form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <h5 className="pb-1 text-heading5">Alerts</h5>
              <hr />
            </div>
            <Controller
              name="alertEnabled"
              control={formMethods.control}
              render={({ field }) => {
                return (
                  <div className="mt-6 flex max-w-[360px] items-center justify-between">
                    <span>Alerts</span>
                    <Switch value={field.value} onChange={field.onChange} />
                  </div>
                );
              }}
            />

            {alertEnabled && (
              <div>
                <Controller
                  name="minimumAlertAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        numeric
                        label="Minimum alert amount ($)"
                        className="mt-6 max-w-[360px]"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                      />
                    );
                  }}
                />
                <div className="mt-6 grid grid-cols-2 gap-2 lg:gap-4">
                  <div className="flex max-w-[360px] flex-row">
                    <Button
                      size="medium"
                      intent="secondary"
                      prefixIconName={
                        copiedObsLink ? 'CheckCircle2' : undefined
                      }
                      onClick={() => {
                        return validateAndCopy(copyObsLink);
                      }}
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
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h5 className="pb-1 text-heading5">Text-to-speech</h5>
              <hr />
            </div>
            <Controller
              name="ttsEnabled"
              control={formMethods.control}
              render={({ field }) => {
                return (
                  <div className="mt-6 flex max-w-[360px] items-center justify-between">
                    <span>Text-to-speech</span>
                    <Switch
                      disabled={!alertEnabled}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                );
              }}
            />

            {ttsEnabled && alertEnabled && (
              <div>
                <Controller
                  name="minimumTTSAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        numeric
                        label="Minimum TTS amount ($)"
                        className="mt-6 max-w-[360px]"
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
                        className="mt-6 max-w-[360px]"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
            )}

            <div className="flex flex-col">
              <div className="flex flex-col gap-2">
                <h5 className="pb-1 text-heading5">AI sound effects</h5>
                <hr />
              </div>
              <Controller
                name="sfxEnabled"
                control={formMethods.control}
                render={({ field }) => {
                  return (
                    <div className="mt-6 flex max-w-[360px] items-center justify-between">
                      <span>AI sound effects</span>
                      <Switch
                        disabled={!alertEnabled}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
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
                        numeric
                        label="Minimum Sfx amount ($)"
                        className="mt-6 max-w-[360px]"
                        helperText={fieldState.error?.message}
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                      />
                    );
                  }}
                />
              )}
            </div>

            <Button
              size="medium"
              intent="primary"
              className="mt-4"
              onClick={formMethods.handleSubmit(onSubmit)}
            >
              SAVE SETTINGS
            </Button>

            {/* TODO: Display modal on save loading and success */}
            {isSaving && (
              <div className="mt-4 flex items-center gap-2">Saving...</div>
            )}
            {saveSuccess && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-mint-600">
                  Changes saved successfully!
                </span>
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
      </div>
    </Card>
  );
}
