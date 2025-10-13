'use client';
import { TWITCH_EXTENSION_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { getAccessToken } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

import { useAuth } from '@/app/creators/context/auth-context';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal/confirmation-modal';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';
import { ToastData, useToast } from '@/app/creators/context/toast-context';

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
          <p className={classes('text-label4 text-neutralGreen-700')}>
            Upgrade your Twitch Setup
          </p>
          <h3 className={classes('text-display6 gradient-text')}>
            Show top fans on your channel
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
  name: string;
  targetAmount: number;
  endDate: Date | null;
};

const errorSaveSettingsToast: Omit<ToastData, 'id'> = {
  type: 'error',
  heading: 'Unable to save settings',
  description: 'Please try again later',
  autoClose: true,
};

// ts-unused-exports:disable-next-line
export default function DonationGoals() {
  const { creator, creatorLoading } = useAuth();
  const { toast, removeToast } = useToast();

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isUrlWarningConfirmed, setIsUrlWarningConfirmed] = useState(false);
  const [confirmButtonText, setConfirmButtonText] = useState('Copy link');
  const [wasCopied, setWasCopied] = useState(false);
  const [unsavedChangesToastId, setUnsavedChangesToastId] = useState('');

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
      name: creator?.name ?? '',
      targetAmount: 0,
      endDate: null,
    },
    mode: 'onSubmit',
  });

  const { isDirty } = formMethods.formState;

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

      console.log(data);
      removeToast(unsavedChangesToastId);
      setUnsavedChangesToastId('');

      toast({
        type: 'success',
        heading: 'Settings saved',
        autoClose: true,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast(errorSaveSettingsToast);
    }
  };

  // TODO: Initialize form values after fetching creator goals
  useEffect(() => {
    if (creator) {
      formMethods.reset({
        name: 'Test goal',
        targetAmount: 1,
        endDate: new Date(),
      });
    }
  }, [creator, formMethods]);

  useEffect(() => {
    if (isDirty && !unsavedChangesToastId) {
      // Create new toast when dirty and no toast exists
      const toastId = toast({
        type: 'error',
        heading: 'You have unsaved changes',
        description: 'Don´t forget to save when you are done',
        iconName: 'RefreshCw',
        closable: false,
      });
      setUnsavedChangesToastId(toastId);
    } else if (!isDirty && unsavedChangesToastId) {
      // Remove toast when no longer dirty
      removeToast(unsavedChangesToastId);
      setUnsavedChangesToastId('');
    }
  }, [isDirty, unsavedChangesToastId, toast, removeToast]);

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
            <SectionHeader title="Active goal" />
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label
                  className={classes('pb-1 text-label4 text-neutralGreen-700')}
                >
                  Goal overlay link
                </label>
                {/* TODO: Replace for donation goal overlay link*/}
                <CopyInput
                  value={`${creator?.obsUrl ?? ''}`}
                  wasCopied={wasCopied}
                  onIconClick={
                    isUrlWarningConfirmed
                      ? () => {
                          if (creator?.obsUrl) {
                            void navigator.clipboard.writeText(creator.obsUrl);
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
                  <span
                    className={classes(
                      'flex items-center space-x-1 text-label7 text-neutral-600 lg:text-label7',
                    )}
                  >
                    Add this as a browser source in your streaming software
                  </span>
                  <Icon
                    name="HelpCircle"
                    size={16}
                    className="p-0.5 text-neutral-600"
                  />
                </div>
              </div>
            </div>
            <Controller
              name="name"
              control={formMethods.control}
              render={({ field, fieldState }) => {
                return (
                  <Form.Field
                    label="Goal name"
                    className="max-w-[360px]"
                    error={Boolean(fieldState.error?.message)}
                    {...field}
                  />
                );
              }}
            />
            <Controller
              name="targetAmount"
              control={formMethods.control}
              render={({ field, fieldState }) => {
                return (
                  <Form.Field
                    className="max-w-[360px]"
                    numeric
                    label="Target amount"
                    helperText={
                      fieldState.error?.message ??
                      'Donation amount that you want to be reached'
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
          </FormFieldWrapper>

          {/* TTS form fields */}
          <FormFieldWrapper>
            <SectionHeader title="Previous goals" />
          </FormFieldWrapper>

          {isDirty && (
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
          {
            /* TODO: Replace for donation goal overlay link*/
          }
          if (confirmButtonText === 'COPY LINK' && creator?.obsUrl) {
            void navigator.clipboard.writeText(creator.obsUrl);
            setWasCopied(true);
            setTimeout(() => {
              return setWasCopied(false);
            }, 2000);
          }
        }}
        title="Confirm before copying"
        sectionSubtitle="Anyone with this link can embed your donation goal on their own stream or website.
          Do not share it with anyone or show it on stream."
        confirmButtonText={confirmButtonText}
        confirmButtonIntent="secondary"
      />
    </Card>
  );
}
