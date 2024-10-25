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
      className="w-full rounded-md bg-[#11DD74] py-2 text-base font-medium text-white shadow-sm hover:bg-[#11DD74]"
      type="submit"
    >
      {children}
    </Button>
  );
};
