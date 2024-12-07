import { classes } from '@idriss-xyz/ui/utils';
import { Outlet } from 'react-router';

import { LINES } from 'assets/images';

type Properties = {
  className?: string;
};

export const PopupContentLayout = ({ className }: Properties) => {
  return (
    <div className={classes('relative h-[498px]', className)}>
      <img
        src={LINES}
        className="pointer-events-none absolute left-0 top-0 hidden opacity-40 lg:block"
        alt=""
      />

      <Outlet />
    </div>
  );
};
