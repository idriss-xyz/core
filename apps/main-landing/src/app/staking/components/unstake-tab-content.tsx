import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';

type FormPayload = {
  amount: number;
};

type Properties = {
  availableAmount: number;
};

export const UnstakeTabContent = ({ availableAmount }: Properties) => {
  const formMethods = useForm<FormPayload>({
    defaultValues: {
      amount: 1,
    },
    mode: 'onSubmit',
  });
  return (
    <Form className="w-full">
      <Controller
        control={formMethods.control}
        name="amount"
        render={({ field }) => {
          return (
            <Form.Field
              {...field}
              className="mt-6"
              value={field.value.toString()}
              onChange={(value) => {
                field.onChange(Number(value));
              }}
              label={
                <div className="flex justify-between">
                  <span className="text-label4 text-neutralGreen-700">
                    Amount to unlock
                  </span>
                  <span className="text-label6 text-neutral-800">
                    Available: {availableAmount} IDRISS
                  </span>
                </div>
              }
              numeric
              prefixIconName="IdrissCircled"
              suffixElement={
                <span className="text-body4 text-neutral-500">IDRISS</span>
              }
            />
          );
        }}
      />
      <Button
        intent="primary"
        size="large"
        className="mt-6 w-full"
        type="submit"
      >
        UNLOCK
      </Button>
    </Form>
  );
};
