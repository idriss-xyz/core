'use client';
import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { getAccessToken } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@/app/context/auth-context';
import { FormFieldWrapper } from '@/app/components/layout';
import { ToastData, useToast } from '@/app/context/toast-context';
import { createDonationGoal } from '@/app/utils';

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

interface NewGoalFormProperties {
  onGoalCreated?: () => void;
  onClose?: () => void;
}

export function NewGoalForm({ onGoalCreated, onClose }: NewGoalFormProperties) {
  const { creator } = useAuth();
  const { toast, removeToast } = useToast();

  const [unsavedChangesToastId, setUnsavedChangesToastId] = useState('');

  const formMethods = useForm<FormPayload>({
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

      await createDonationGoal(
        {
          ...data,
          startDate: Date.now(),
          endDate: data.endDate.getTime(),
        },
        authToken,
      );
      removeToast(unsavedChangesToastId);
      setUnsavedChangesToastId('');
      formMethods.reset();

      toast({
        type: 'success',
        heading: 'Settings saved',
        autoClose: true,
      });

      if (onGoalCreated) {
        onGoalCreated();
      }
    } catch (error) {
      console.error('Error saving donation goal:', error);
      toast(errorSaveSettingsToast);
    }
  };

  useEffect(() => {
    if (isDirty && !unsavedChangesToastId) {
      console.log('creating new toast');
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

  return (
    <>
      <h5 className="pb-1 text-heading5 text-neutralGreen-900">
        Creating a new goal
      </h5>
      <Form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormFieldWrapper>
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
                  placeholder="New microphone"
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
                  placeholder="500"
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
                  label="End date (optional)"
                  helperText={fieldState.error?.message}
                  error={Boolean(fieldState.error?.message)}
                  datePicker
                  dateValue={field.value}
                  onDateChange={(date) => {
                    field.onChange(date);
                  }}
                  value={field.value?.toString()} // Required prop but not used for date picker
                  onChange={() => {}} // Required prop but not used for date picker
                />
              );
            }}
          />
        </FormFieldWrapper>

        <div className="flex gap-4">
          <Button
            size="medium"
            intent="secondary"
            className="mt-4 uppercase"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="medium"
            intent="primary"
            className="mt-4 uppercase"
            onClick={formMethods.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
}
