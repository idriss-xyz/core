import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_DARK_LOGO } from 'assets/images';

type Properties = {
  className?: string;
};

export const TopBar = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'z-1 flex h-12 items-center justify-between border-b border-b-neutral-300 bg-white px-6 py-0.5',
        className,
      )}
    >
      <img
        src={IDRISS_DARK_LOGO}
        onClick={() => {}}
        className="h-4.5 cursor-pointer"
        alt=""
      />
      <div className="flex h-full items-center space-x-6">
        <div className="invisible h-full w-[42px]" />
      </div>
    </div>
  );
};
