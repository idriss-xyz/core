'use client';
import {
  CREATORS_LINK,
  CREATOR_API_URL,
  TWITCH_EXTENSION_LINK,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { Toggle } from '@idriss-xyz/ui/toggle';
// import { Alert } from '@idriss-xyz/ui/alert';
import { getAccessToken } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { Icon } from '@idriss-xyz/ui/icon';

import { editCreatorProfile } from '@/app/creators/utils';
import { useAuth } from '@/app/creators/context/auth-context';
import { soundMap, testDonation } from '@/app/creators/constants';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';

import { File } from '../file-upload/file';
import { Select } from '../select';

const UpgradeBox: React.FC = () => {
  return (
    <div className="relative flex flex-row items-center gap-4 rounded-lg bg-white/80 p-4">
      <GradientBorder
        gradientDirection="toRight"
        borderRadius={8}
        gradientStopColor="#E8FCE3"
      />
      <div className="flex flex-row items-center gap-6">
        <IconButton
          iconName="TwitchOutlinedBold2"
          intent="secondary"
          size="extra"
          className="pointer-events-none"
        />
        <div className="flex w-[477px] flex-col gap-4 uppercase">
          <p className="text-label4 text-neutralGreen-700">
            Upgrade your Twitch Setup
          </p>
          <h3 className="text-display6 gradient-text">
            Show top donors on your channel
          </h3>
        </div>
      </div>
      <Button
        asLink
        href={TWITCH_EXTENSION_LINK}
        size="medium"
        intent="secondary"
        className="uppercase"
        suffixIconName="ArrowRight"
      >
        Add Twitch extension
      </Button>
    </div>
  );
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
  alertSound: string;
};

export default function StreamAlerts() {
  const { creator } = useAuth();

  // TODO: Extract to constants
  const alertSounds = [
    { value: 'DEFAULT_TRUMPET_SOUND', label: 'Classic trumpet' },
    { value: 'DEFAULT_COIN_SOUND', label: 'Coin drop' },
    { value: 'DEFAULT_CASH_REGISTER_SOUND', label: 'Cash register' },
    {
      value: 'upload',
      label: creator?.alertSound === 'upload' ? 'Replace custom' : 'Custom',
      renderLabel: () => {
        return (
          <span className="text-mint-500 underline">
            {creator?.alertSound === 'upload'
              ? 'Replace custom sound'
              : '+ Upload your own'}
          </span>
        );
      },
    },
  ];

  const [_saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [_testDonationSuccess, setTestDonationSuccess] = useState<
    boolean | null
  >(null);
  const [showCustomUpload, setShowCustomUpload] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      minimumAlertAmount: creator?.minimumAlertAmount ?? 1,
      minimumTTSAmount: creator?.minimumTTSAmount ?? 5,
      minimumSfxAmount: creator?.minimumSfxAmount ?? 10,
      alertEnabled: creator?.alertEnabled ?? false,
      ttsEnabled: creator?.ttsEnabled ?? false,
      sfxEnabled: creator?.sfxEnabled ?? false,
      customBadWords: creator?.customBadWords ?? [],
      alertSound: creator?.alertSound ?? 'DEFAULT_TRUMPET_SOUND',
    },
    mode: 'onSubmit',
  });
  const [alertEnabled, ttsEnabled, sfxEnabled, alertSound] = formMethods.watch([
    'alertEnabled',
    'ttsEnabled',
    'sfxEnabled',
    'alertSound',
  ]);

  // Update showCustomUpload when alertSound changes
  useEffect(() => {
    setShowCustomUpload(alertSound === 'upload');
  }, [alertSound]);

  const sendTestDonation = useCallback(() => {
    if (!creator?.primaryAddress || !isAddress(creator.primaryAddress)) {
      setTestDonationSuccess(false);
      return;
    }

    localStorage.setItem('testDonation', JSON.stringify(testDonation));

    setTestDonationSuccess(true);
  }, [creator?.primaryAddress]);

  // const handleAlertClose = useCallback(() => {
  //   setSaveSuccess(null);
  // }, []);

  // const handleTestDonationClose = useCallback(() => {
  //   setTestDonationSuccess(null);
  // }, []);

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
          alertSound: data.alertSound,
        },
        authToken,
      );

      setSaveSuccess(editSuccess);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Initialize form values after fetching creator data
  useEffect(() => {
    if (creator) {
      formMethods.reset({
        minimumAlertAmount: creator.minimumAlertAmount ?? 1,
        minimumTTSAmount: creator.minimumTTSAmount ?? 5,
        minimumSfxAmount: creator.minimumSfxAmount ?? 10,
        alertEnabled: creator.alertEnabled ?? false,
        ttsEnabled: creator.ttsEnabled ?? false,
        sfxEnabled: creator.sfxEnabled ?? false,
        customBadWords: creator.customBadWords ?? [],
        alertSound: creator.alertSound ?? 'DEFAULT_TRUMPET_SOUND',
      });
      // Set initial state of custom upload based on creator's alertSound
      setShowCustomUpload(creator.alertSound === 'upload');
    }
  }, [creator, formMethods]);

  const handleAlertSoundChange = (value: string) => {
    formMethods.setValue('alertSound', value);
    setShowCustomUpload(value === 'upload');
  };

  const fileUploadCallback = useCallback(() => {
    setShowCustomUpload(false);
    // TODO: Change dropdown label to Replace custom
  }, [setShowCustomUpload]);

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-6">
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
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      setTimeout(() => {
                        void void formMethods.handleSubmit(onSubmit)();
                      }, 0); // defer to ensure updated value
                    }}
                  />
                );
              }}
            />

            {alertEnabled && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="pb-1 text-label4 text-neutralGreen-700">
                      Overlay link
                    </label>
                    <CopyInput
                      value={`${CREATORS_LINK}/obs/${creator?.name}`}
                    />
                    <div className="flex items-center pt-1">
                      <span className="flex items-center space-x-1 text-label7 text-neutral-600 lg:text-label7">
                        Add this as a browser source in your streaming software
                      </span>
                      <Icon
                        name="HelpCircle"
                        size={16}
                        className="p-0.5 text-neutral-600"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="medium"
                      intent="secondary"
                      onClick={sendTestDonation}
                      className="h-fit"
                    >
                      TEST ALERT
                    </Button>
                  </div>
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
                        onChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        prefixElement={<span>$</span>}
                      />
                    );
                  }}
                />
                <Controller
                  name="alertSound"
                  control={formMethods.control}
                  render={({ field, fieldState: _ }) => {
                    return (
                      <Select
                        label="Select a sound"
                        value={field.value?.toString()}
                        className="max-w-[360px]"
                        options={alertSounds}
                        onChange={handleAlertSoundChange}
                        iconName="PlayCircle"
                        isAudioPlaying={isAudioPlaying}
                        onIconClick={() => {
                          if (isAudioPlaying) return;

                          let soundFile: string | undefined;

                          if (field.value === 'upload') {
                            if (creator?.name) {
                              soundFile = `${CREATOR_API_URL}/creator-profile/audio/${creator.name}`;
                            }
                          } else {
                            soundFile = soundMap[field.value];
                          }

                          if (soundFile) {
                            const audio = new Audio(soundFile);
                            audio.addEventListener('play', () => {
                              return setIsAudioPlaying(true);
                            });
                            audio.addEventListener('ended', () => {
                              return setIsAudioPlaying(false);
                            });
                            audio.addEventListener('error', () => {
                              setIsAudioPlaying(false);
                              console.error('Error playing sound');
                            });
                            void audio.play();
                          }
                        }}
                        // TODO: Add error handling
                        // error={Boolean(fieldState.error?.message)}
                      />
                    );
                  }}
                />
                {showCustomUpload && <File onUpload={fileUploadCallback} />}
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        label="Text-to-speech"
                        sublabel="Reads the donation message aloud during the alert"
                        value={alertEnabled ? field.value : false}
                        disabled={!alertEnabled}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setTimeout(() => {
                            void formMethods.handleSubmit(onSubmit)();
                          }, 0); // defer to ensure updated value
                        }}
                        className="w-fit"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      hidden={alertEnabled}
                      className="z-portal bg-black text-white"
                      side="right"
                    >
                      <p className="text-body6">
                        Turn on Alerts to use this feature
                      </p>
                    </TooltipContent>
                  </Tooltip>
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
                          'Donation amount that triggers text-to-speech'
                        }
                        error={Boolean(fieldState.error?.message)}
                        {...field}
                        value={field.value?.toString()}
                        onChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        prefixElement={<span>$</span>}
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
                        label="Custom bad words filter"
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        label="AI sound effects"
                        sublabel="Replaces the default alert sound with a custom effect"
                        value={alertEnabled ? field.value : false}
                        disabled={!alertEnabled}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setTimeout(() => {
                            void formMethods.handleSubmit(onSubmit)();
                          }, 0); // defer to ensure updated value
                        }}
                        className="w-fit"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      hidden={alertEnabled}
                      className="z-portal bg-black text-white"
                      side="right"
                    >
                      <p className="text-body6">
                        Turn on Alerts to use this feature
                      </p>
                    </TooltipContent>
                  </Tooltip>
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
                      onChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      prefixElement={<span>$</span>}
                    />
                  );
                }}
              />
            )}
          </FormFieldWrapper>

          {alertEnabled && (
            <Button
              size="medium"
              intent="primary"
              className="mt-4"
              onClick={formMethods.handleSubmit(onSubmit)}
            >
              SAVE SETTINGS
            </Button>
          )}

          <UpgradeBox />
        </Form>
      </div>

      {/* Alerts */}
      {/* {testDonationSuccess && (
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
      )} */}
    </Card>
  );
}
