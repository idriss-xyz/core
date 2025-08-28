'use client';
import { CREATOR_API_URL, TWITCH_EXTENSION_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { Toggle } from '@idriss-xyz/ui/toggle';
import { getAccessToken } from '@privy-io/react-auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  defaultAlertSounds,
  soundMap,
  voiceMap,
} from '@/app/creators/constants';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal/confirmation-modal';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';
import { ToastData, useToast } from '@/app/creators/context/toast-context';

import { File } from '../file-upload/file';
import { Select } from '../select';
import SkeletonSetup from '../loading';

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

const voices = Object.entries(voiceMap).map(([id, { name }]) => {
  return {
    value: id,
    label: name,
  };
});

const errorTestAlertToast: Omit<ToastData, 'id'> = {
  type: 'error',
  heading: 'Unable to send test alert',
  description: 'Check your streaming software and verify the link',
  iconName: 'BellRing',
  autoClose: true,
};

const errorSaveSettingsToast: Omit<ToastData, 'id'> = {
  type: 'error',
  heading: 'Unable to save settings',
  description: 'Please try again later',
  autoClose: true,
};

// ts-unused-exports:disable-next-line
export default function StreamAlerts() {
  const { creator, creatorLoading, setCreator } = useAuth();
  const { toast, removeToast } = useToast();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isUrlWarningConfirmed, setIsUrlWarningConfirmed] = useState(false);
  const [confirmButtonText, setConfirmButtonText] = useState('Copy link');
  const [wasCopied, setWasCopied] = useState(false);
  const [unsavedChangesToastId, setUnsavedChangesToastId] = useState('');

  // TODO: Extract to constants
  const alertSounds = [
    ...defaultAlertSounds,
    ...(uploadedFile ? [{ value: 'CUSTOM_SOUND', label: 'Custom' }] : []),
    {
      value: 'upload',
      label: 'Upload',
      renderLabel: () => {
        return (
          <span className="text-mint-500 underline">
            {uploadedFile ? 'Replace custom sound' : '+ Upload your own'}
          </span>
        );
      },
    },
  ];

  const openConfirmationModal = (source: 'text' | 'icon') => {
    if (source === 'icon') {
      setConfirmButtonText('COPY LINK');
    } else {
      setConfirmButtonText('GOT IT');
    }
    setIsCopyModalOpen(true);
  };

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
      voiceId: creator?.voiceId ?? 'TX3LPaxmHKxFdv7VOQHJ',
    },
    mode: 'onSubmit',
  });
  const [alertEnabled, ttsEnabled, sfxEnabled, alertSound] = formMethods.watch([
    'alertEnabled',
    'ttsEnabled',
    'sfxEnabled',
    'alertSound',
  ]);

  const sendTestDonation = useCallback(async () => {
    if (!creator?.primaryAddress || !isAddress(creator.primaryAddress)) {
      toast(errorTestAlertToast);
      return;
    }

    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        toast(errorTestAlertToast);
        console.error('Could not get auth token.');
        return;
      }

      const response = await fetch(
        `${CREATOR_API_URL}/creator-profile/test-alert`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.ok) {
        toast({
          type: 'success',
          heading: 'Test alert sent successfully!',
          description: 'Check your stream preview to see it',
          iconName: 'BellRing',
          autoClose: true,
        });
      } else {
        toast(errorTestAlertToast);
      }
    } catch (error) {
      console.error('Error sending test donation:', error);
      toast(errorTestAlertToast);
    }
  }, [creator?.primaryAddress, toast]);

  const onSubmit = async (data: FormPayload) => {
    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        toast(errorSaveSettingsToast);
        console.error('Could not get auth token.');
        return;
      }
      if (!creator?.name) {
        toast(errorSaveSettingsToast);
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
          voiceId: data.voiceId,
        },
        authToken,
      );

      if (editSuccess) {
        formMethods.reset(data, { keepValues: true });

        setCreator((previous) => {
          return previous ? { ...previous, ...data } : previous;
        });

        removeToast(unsavedChangesToastId);
        setUnsavedChangesToastId('');

        toast({
          type: 'success',
          heading: 'Settings saved!',
          autoClose: true,
        });
      } else {
        toast(errorSaveSettingsToast);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast(errorSaveSettingsToast);
    }
  };

  const onSubmitToggles = async (data: FormPayload) => {
    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        console.error('Could not get auth token.');
        return;
      }
      if (!creator?.name) {
        console.error('Creator not initialized');
        return;
      }

      await editCreatorProfile(
        creator.name,
        {
          alertEnabled: data.alertEnabled,
          ttsEnabled: data.ttsEnabled,
          sfxEnabled: data.sfxEnabled,
        },
        authToken,
      );

      setCreator((previous) => {
        return previous ? { ...previous, ...data } : previous;
      });
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
        voiceId: creator.voiceId ?? 'TX3LPaxmHKxFdv7VOQHJ',
      });
      // Set initial state of custom upload based on creator's alertSound
      if (creator.alertSound === 'CUSTOM_SOUND') {
        setUploadedFile({ name: 'custom-sound.mp3', size: 0 } as File);
      }
    }
  }, [creator, formMethods]);

  const handleAlertSoundChange = (value: string) => {
    formMethods.setValue('alertSound', value, { shouldDirty: true });
  };

  const handleVoiceChange = (value: string) => {
    formMethods.setValue('voiceId', value, { shouldDirty: true });
  };

  const fileUploadCallback = useCallback(
    (file: File) => {
      setUploadedFile(file);
      formMethods.setValue('alertSound', 'CUSTOM_SOUND', { shouldDirty: true });
    },
    [formMethods],
  );

  const handleFileRemove = useCallback(() => {
    setUploadedFile(null);
    formMethods.setValue('alertSound', 'DEFAULT_TRUMPET_SOUND', {
      shouldDirty: true,
    });
  }, [formMethods]);

  // Keep track of dirty form state (non-toggles only)
  const isDirtyNonToggles = useMemo(() => {
    const { dirtyFields } = formMethods.formState;

    const nonToggleDirtyFields = Object.keys(dirtyFields).filter((field) => {
      return !['alertEnabled', 'ttsEnabled', 'sfxEnabled'].includes(field);
    });
    return nonToggleDirtyFields.length > 0;
  }, [formMethods.formState]);

  useEffect(() => {
    if (isDirtyNonToggles && !unsavedChangesToastId) {
      // Create new toast when dirty and no toast exists
      const toastId = toast({
        type: 'error',
        heading: 'You have unsaved changes',
        description: 'Don´t forget to save when you are done',
        iconName: 'RefreshCw',
        closable: false,
      });
      setUnsavedChangesToastId(toastId);
    } else if (!isDirtyNonToggles && unsavedChangesToastId) {
      // Remove toast when no longer dirty
      removeToast(unsavedChangesToastId);
      setUnsavedChangesToastId('');
    }
  }, [isDirtyNonToggles, unsavedChangesToastId, toast, removeToast]);

  // Cleanup toast on unmount
  useEffect(() => {
    return () => {
      if (unsavedChangesToastId) {
        removeToast(unsavedChangesToastId);
      }
    };
  }, [unsavedChangesToastId, removeToast]);

  if (creatorLoading) {
    return <SkeletonSetup />;
  }

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
                        void void formMethods.handleSubmit(onSubmitToggles)();
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
                      value={`${creator?.obsUrl ?? ''}`}
                      wasCopied={wasCopied}
                      onIconClick={
                        isUrlWarningConfirmed
                          ? () => {
                              if (creator?.obsUrl) {
                                void navigator.clipboard.writeText(
                                  creator.obsUrl,
                                );
                                setWasCopied(true);
                                setTimeout(() => {
                                  return setWasCopied(false);
                                }, 2000);
                              }
                            }
                          : () => {
                              return openConfirmationModal('icon');
                            }
                      }
                      onTextClick={
                        isUrlWarningConfirmed
                          ? () => {}
                          : () => {
                              return openConfirmationModal('text');
                            }
                      }
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
                      suffixIconName="IdrissArrowRight"
                    >
                      TEST ALERT
                    </Button>
                  </div>
                </div>
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

                          if (field.value === 'CUSTOM_SOUND') {
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
                {(alertSound === 'upload' || alertSound === 'CUSTOM_SOUND') && (
                  <File
                    onUpload={fileUploadCallback}
                    onRemove={handleFileRemove}
                    placeholderFile={uploadedFile}
                    showUploadInterface={alertSound === 'upload'}
                  />
                )}
                <Controller
                  name="minimumAlertAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        className="max-w-[360px]"
                        numeric
                        label="Minimum amount"
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
                            void formMethods.handleSubmit(onSubmitToggles)();
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
                  name="voiceId"
                  control={formMethods.control}
                  render={({ field, fieldState: _ }) => {
                    return (
                      <Select
                        label="Select a voice"
                        value={field.value?.toString()}
                        className="max-w-[360px]"
                        options={voices}
                        onChange={handleVoiceChange}
                        iconName="PlayCircle"
                        isAudioPlaying={isVoicePlaying}
                        onIconClick={() => {
                          if (isVoicePlaying) return;
                          const voiceData = voiceMap[field.value];
                          if (voiceData) {
                            const audio = new Audio(voiceData.audioFile);
                            audio.addEventListener('play', () => {
                              return setIsVoicePlaying(true);
                            });
                            audio.addEventListener('ended', () => {
                              return setIsVoicePlaying(false);
                            });
                            audio.addEventListener('error', () => {
                              setIsVoicePlaying(false);
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
                <Controller
                  name="minimumTTSAmount"
                  control={formMethods.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Form.Field
                        className="max-w-[360px]"
                        numeric
                        label="Minimum amount"
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
                            void formMethods.handleSubmit(onSubmitToggles)();
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

          {alertEnabled && isDirtyNonToggles && (
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

      <ConfirmationModal
        isOpened={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setIsUrlWarningConfirmed(true);
        }}
        onConfirm={() => {
          if (confirmButtonText === 'COPY LINK' && creator?.obsUrl) {
            void navigator.clipboard.writeText(creator.obsUrl);
            setWasCopied(true);
            setTimeout(() => {
              return setWasCopied(false);
            }, 2000);
          }
        }}
        title="Confirm before copying"
        sectionSubtitle="Anyone with this link can embed your stream alerts on their own stream or website.
          Do not share it with anyone or show it on stream."
        confirmButtonText={confirmButtonText}
        confirmButtonIntent="secondary"
      />
    </Card>
  );
}
