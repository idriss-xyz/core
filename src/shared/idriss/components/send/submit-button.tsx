import { ReactNode } from 'react';

import { Button } from 'shared/ui';

interface Properties {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export const SubmitButton = ({ loading, children, disabled }: Properties) => {
  return (
    <Button
      loading={loading}
      disabled={disabled}
      className="w-full rounded-md bg-idriss-primary-500 py-2 text-base font-medium text-white shadow-sm hover:bg-idriss-primary-400"
      type="submit"
    >
      {children}
    </Button>
  );
};
