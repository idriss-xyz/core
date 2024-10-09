import { ReactNode, useCallback } from 'react';

import { IconButton } from 'shared/ui';

import { useExtensionPopup } from '../../extension-popup-context';
import { EXTENSION_POPUP_ROUTE } from '../../constants';

type Properties = {
  title?: string;
  prefix?: ReactNode;
};

export const SettingsLayoutHeader = ({ title, prefix }: Properties) => {
  const extensionPopup = useExtensionPopup();

  const goHome = useCallback(() => {
    extensionPopup.navigate(EXTENSION_POPUP_ROUTE.HOME);
  }, [extensionPopup]);

  return (
    <div className="sticky top-0 flex items-center justify-between bg-gray-100 px-6 py-4 text-lg font-bold">
      {prefix ?? <div className="w-7" />}

      <span className="block">{title}</span>

      <IconButton
        className="text-black hover:text-green-500"
        iconProps={{ name: 'Cross1Icon', size: 24 }}
        onClick={goHome}
      />
    </div>
  );
};
