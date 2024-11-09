import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { useCallback } from 'react';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

export const Navigation = () => {
  const { wallet, openConnectionModal, removeWalletInfo } = useWallet();
  const popup = useExtensionPopup();

  const goToSettings = useCallback(() => {
    popup.navigate(POPUP_ROUTE.SETTINGS);
  }, [popup]);

  return (
    <ul>
      <li>
        <NavigationMenu.Link asChild>
          <button
            onClick={goToSettings}
            className="group flex w-full items-center space-x-3 px-3 pb-1.5 pt-3"
          >
            <Icon
              className="text-neutral-600 group-hover:text-mint-600"
              name="Settings"
              size={20}
            />
            <span className="text-body4 text-neutral-900 group-hover:text-mint-600">
              Customization
            </span>
          </button>
        </NavigationMenu.Link>
      </li>

      <li>
        <NavigationMenu.Link asChild>
          <ExternalLink
            href={SOCIAL_LINK.DISCORD}
            className="group flex w-full items-center space-x-3 px-3 pb-3 pt-1.5"
          >
            <Icon
              className="text-neutral-600 group-hover:text-mint-600"
              name="HelpCircle"
              size={20}
            />
            <span className="text-body4 text-neutral-900 group-hover:text-mint-600">
              Support
            </span>
          </ExternalLink>
        </NavigationMenu.Link>
      </li>

      <hr className="text-neutral-200" />

      <li>
        <NavigationMenu.Link asChild>
          <button
            onClick={wallet ? removeWalletInfo : openConnectionModal}
            className="group flex w-full items-center space-x-3 p-3"
          >
            <Icon
              className="text-neutral-600 group-hover:text-mint-600"
              name={wallet ? 'LogOut' : 'LogIn'}
              size={20}
            />
            <span className="text-body4 text-neutral-900 group-hover:text-mint-600">
              {wallet ? 'Log Out' : 'Log In'}
            </span>
          </button>
        </NavigationMenu.Link>
      </li>
    </ul>
  );
};
