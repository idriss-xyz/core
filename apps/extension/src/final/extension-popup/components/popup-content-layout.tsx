import { classes } from '@idriss-xyz/ui/utils';
import { Outlet } from 'react-router';

type Properties = {
  className?: string;
  backgroundImage: string;
};

export const PopupContentLayout = ({
  className,
  backgroundImage,
}: Properties) => {
  return (
    <div className={classes('relative h-[498px]', className)}>
      <img
        src={backgroundImage}
        className="pointer-events-none absolute left-0 top-0 hidden lg:block"
        alt=""
      />

      <Outlet />
    </div>
  );
};
