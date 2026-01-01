import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { DOCUMENTATION_LINK_DAO } from '@idriss-xyz/constants';

import { EXTERNAL_LINK, INTERNAL_LINK } from '@/constants';

type Properties = {
  className?: string;
};

export const Menu = ({ className }: Properties) => {
  return (
    <NavigationMenu.Root className={className}>
      <NavigationMenu.List className="flex space-x-10">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Button
                intent="tertiary"
                size="large"
                href={INTERNAL_LINK.CREATORS}
                asLink
              >
                APP
              </Button>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Button
                intent="tertiary"
                size="large"
                href={INTERNAL_LINK.TOKEN}
                asLink
              >
                TOKEN
              </Button>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Button
                intent="tertiary"
                size="large"
                href={EXTERNAL_LINK.VAULT}
                isExternal
                asLink
              >
                VAULT
              </Button>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Button
                intent="tertiary"
                size="large"
                href={DOCUMENTATION_LINK_DAO}
                isExternal
                asLink
              >
                DOCS
              </Button>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
