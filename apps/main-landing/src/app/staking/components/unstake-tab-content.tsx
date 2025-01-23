import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';

type FormPayload = {
  amount: number;
};

export const UnstakeTabContent = () => {
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
              label="Amount to unstake"
              numeric
            />
          );
        }}
      />
    </Form>
  );
};
