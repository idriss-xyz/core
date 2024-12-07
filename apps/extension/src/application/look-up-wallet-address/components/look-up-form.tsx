import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { IconButton, Spinner } from 'shared/ui';

import { LookupFormValues } from '../types';

type Properties = {
  form: UseFormReturn<LookupFormValues>;
  onSubmit: SubmitHandler<LookupFormValues>;
  isLoading: boolean;
  onReset: () => void;
  className?: string;
};
export const LookupForm = ({
  form,
  onSubmit,
  isLoading,
  onReset,
  className,
}: Properties) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <label
        htmlFor="identifier"
        className="mb-2 block text-base font-bold text-[#374151]"
      >
        Look up an address
      </label>
      <div className="flex flex-row gap-x-[10px]">
        <div className="relative grow">
          <Controller
            name="identifier"
            control={form.control}
            render={({ field }) => {
              return (
                <>
                  <input
                    {...field}
                    autoFocus
                    id="identifier"
                    className="box-border block h-[38px] w-full rounded border border-[#cccccc] bg-white py-2 pl-3 pr-10 align-middle font-sans text-sm text-[#333333] outline-none"
                    placeholder="hello@idriss.xyz  |  +1 650...  |  @IDriss_xyz"
                  />
                  {!isLoading && field.value.length > 0 && (
                    <IconButton
                      iconProps={{ name: 'Cross1Icon' }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-black transition-transform hover:scale-90"
                      onClick={onReset}
                    />
                  )}
                </>
              );
            }}
          />

          {isLoading && (
            <div className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center">
              <Spinner className="h-4" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="h-[38px] w-20 rounded-md bg-[#11DD74] py-2 text-base font-medium text-white shadow-sm hover:bg-[#11DD74]"
        >
          Search
        </button>
      </div>
    </form>
  );
};
