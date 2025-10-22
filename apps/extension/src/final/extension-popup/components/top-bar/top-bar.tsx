import { classes } from '@idriss-xyz/ui/utils';
import { useCallback } from 'react';

import { IDRISS_DARK_LOGO } from 'assets/images';
import {
  POPUP_ROUTE,
  useExtensionPopup,
  } from 'shared/extension';


type Properties = {
  className?: string;
};

export const TopBar = ({ className }: Properties) => {
  const popup = useExtensionPopup();


  const goToProducts = useCallback(() => {
    popup.navigate(POPUP_ROUTE.PRODUCTS);
  }, [popup]);

  return (
    <div
  className={classes(
    'z-1 flex items-center justify-between border-b border-b-neutral-300 bg-white px-6 py-0.5 h-12',
    className,
  )}
>
  <img
    src={IDRISS_DARK_LOGO}
    onClick={goToProducts}
    className="h-4.5 cursor-pointer"
    alt=""
  />
  <div className="flex items-center space-x-6 h-full">
    <div className="h-full w-[42px] invisible" />
  </div>
</div>
  );
};
