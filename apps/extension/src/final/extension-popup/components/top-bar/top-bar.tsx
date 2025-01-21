import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { Switch } from '@idriss-xyz/ui/switch';
import { classes } from '@idriss-xyz/ui/utils';
import { useCallback } from 'react';

import { IDRISS_DARK_LOGO } from 'assets/images';
import {
  POPUP_ROUTE,
  useExtensionPopup,
  useExtensionSettings,
} from 'shared/extension';

import { Navigation } from './navigation';

type Properties = {
  className?: string;
  userVersion: string;
  newestVersion: string;
};

export const TopBar = ({
  className,
  userVersion,
  newestVersion,
}: Properties) => {
  const { extensionSettings, changeExtensionSetting } = useExtensionSettings();
  const popup = useExtensionPopup();

  const toggleExtensionEnabled = useCallback(
    (value: boolean) => {
      void changeExtensionSetting({
        name: 'entire-extension-enabled',
        value,
      });
    },
    [changeExtensionSetting],
  );

  const goToProducts = useCallback(() => {
    popup.navigate(POPUP_ROUTE.PRODUCTS);
  }, [popup]);

  // TODO: render buttons based on condition
  // const isVersionOutdated = checkIfVersionIsOutdated(
  //   userVersion,
  //   newestVersion,
  // );

  return (
    <div
      className={classes(
        'z-1 flex items-center justify-between border-b border-b-neutral-300 bg-white px-6 py-0.5',
        className,
      )}
    >
      <img
        src={IDRISS_DARK_LOGO}
        onClick={goToProducts}
        className="h-4.5 cursor-pointer"
        alt=""
      />
      <div className="flex items-center space-x-6">
        {/*{isVersionOutdated ? (*/}
        <IconButton
          iconName="AlertCircle"
          size="medium"
          intent="tertiary"
          onClick={() => {
            return window.alert(
              `Your extension is outdated. You're currently using version ${userVersion}, while the latest version available is ${newestVersion}.`,
            );
          }}
          className="text-red-500"
        />
        {/*) : (*/}
        <IconButton
          iconName="CheckCircle2"
          size="medium"
          intent="tertiary"
          onClick={() => {
            return window.alert(
              `You're using the latest version ${userVersion}.`,
            );
          }}
          className="text-mint-600"
        />
        {/*)}*/}

        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item className="relative">
              <NavigationMenu.Trigger asChild>
                <IconButton iconName="Grip" size="medium" intent="tertiary" />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute right-2 top-10 w-[240px] rounded-xl border border-neutral-300 bg-white shadow-lg">
                <Navigation />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <Switch
          value={extensionSettings['entire-extension-enabled']}
          onChange={toggleExtensionEnabled}
        />
      </div>
    </div>
  );
};

// const convertVersionIntoNumber = (version: string): string => {
//   return version.replaceAll('.', '');
// };
//
// const checkIfVersionIsOutdated = (
//   userVersion: string,
//   newestVersion: string,
// ): boolean => {
//   return (
//     convertVersionIntoNumber(userVersion) <
//     convertVersionIntoNumber(newestVersion)
//   );
// };
