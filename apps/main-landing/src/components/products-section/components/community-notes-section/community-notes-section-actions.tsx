import { IDRISS_LEGACY_API_URL } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

type WaitlistInput = {
  email: string;
};

//TODO Add zod validation and remove inline validation from Controller
export const CommunityNotesSectionActions = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistInput>({
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: WaitlistInput) => {
      const response = await fetch(`${IDRISS_LEGACY_API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      await response.json();
    },
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: WaitlistInput) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-3 transition-transform duration-1000 md:flex-row lg:flex-row lg:gap-2"
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address.',
            },
          }}
          render={({ field }) => {
            return (
              //TODO add input to the DS
              <input
                type="email"
                className={classes(
                  'flex w-full flex-[1_0_0] items-center rounded-[12px] px-3 py-[10px] text-body4 shadow-[0_0_0_4px_rgba(242,242,242,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 md:w-1/2 lg:w-[290px]',

                  mutation.isError && 'border-red-500',
                  mutation.isSuccess && 'border-mint-500',
                )}
                placeholder="Your email"
                id="email"
                disabled={mutation.isPending}
                {...field}
              />
            );
          }}
        />
        <Button
          type="submit"
          intent="secondary"
          size="medium"
          className="w-full md:w-1/2 lg:w-fit"
          disabled={mutation.isPending}
        >
          GET EARLY ACCESS
        </Button>
      </form>
      <div className="flex flex-col">
        {mutation.isSuccess && (
          <span
            className={classes(
              'flex items-center gap-x-1 pt-1 text-label7 text-mint-500 lg:text-label6',
            )}
          >
            You&#39;re on the list. Stay tuned for updates.
          </span>
        )}

        {errors.email && (
          <span
            className={classes(
              'flex items-center gap-x-1 pt-1 text-label7 text-red-500 lg:text-label6',
            )}
          >
            <Icon name="AlertCircle" size={12} className="p-px" />
            {errors.email.message}
          </span>
        )}

        {mutation.isError && (
          <span
            className={classes(
              'flex items-center gap-x-1 pt-1 text-label7 text-red-500 lg:text-label6',
            )}
          >
            <Icon name="AlertCircle" size={12} className="p-px" />
            We couldn&#39;t add you to the waitlist. Try again later.
          </span>
        )}
      </div>
    </div>
  );
};
