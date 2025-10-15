'use client';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { Form } from '@idriss-xyz/ui/form';
import { getAccessToken } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { usePathname } from 'next/navigation';
import { TabItem, TabsPill } from '@idriss-xyz/ui/tabs-pill';
import Link from 'next/link';

import { useAuth } from '@/app/creators/context/auth-context';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal/confirmation-modal';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import { FormFieldWrapper } from '@/app/creators/components/layout';
import { ToastData, useToast } from '@/app/creators/context/toast-context';

import SkeletonSetup from '../loading';

type FormPayload = {
  name: string;
  targetAmount: number;
  endDate: Date;
};

const errorSaveSettingsToast: Omit<ToastData, 'id'> = {
  type: 'error',
  heading: 'Unable to save settings',
  description: 'Please try again later',
  autoClose: true,
};

const renderLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return <Link href={href}>{children}</Link>;
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

  const pathname = usePathname();

  const donationGoalsTabs: TabItem[] = [
    {
      name: 'Active',
      href: '/creators/app/donation-goals/active',
      iconName: 'Goal',
      isActive: pathname === '/creators/app/donation-goals/active',
    },
    {
      name: 'History',
      href: '/creators/app/donation-goals/history',
      iconName: 'History',
      isActive: pathname === '/creators/app/donation-goals/history',
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
      name: creator?.name ?? '',
      targetAmount: 0,
      endDate: new Date(),
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
          <FormFieldWrapper>
            <div className="flex items-center gap-2">
              <h5 className="pb-1 text-heading5 text-neutralGreen-900">
                Donation goals
              </h5>
              <TabsPill tabs={donationGoalsTabs} renderLink={renderLink} />
            </div>
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
                    Copy this permanent link to show your goal on stream.
                  </span>
                  <Icon
                    name="HelpCircle"
                    size={16}
                    className="p-0.5 text-neutral-600"
                  />
                </div>
              </div>
            </div>
            <hr />
            <h5 className="pb-1 text-heading5 text-neutralGreen-900">
              Creating a new goal
            </h5>
            {/* Fields for active goal */}
            <Controller
              name="name"
              control={formMethods.control}
              render={({ field, fieldState }) => {
                return (
                  <Form.Field
                    label="Name"
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
                    helperText={fieldState.error?.message}
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
              name="endDate"
              control={formMethods.control}
              render={({ field, fieldState }) => {
                return (
                  <Form.Field
                    name="endDate"
                    className="max-w-[360px]"
                    label="End date"
                    helperText={fieldState.error?.message}
                    error={Boolean(fieldState.error?.message)}
                    datePicker
                    dateValue={field.value}
                    onDateChange={(date) => {
                      field.onChange(date);
                    }}
                    value={field.value.toString()} // Required prop but not used for date picker
                    onChange={() => {}} // Required prop but not used for date picker
                  />
                );
              }}
            />
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
