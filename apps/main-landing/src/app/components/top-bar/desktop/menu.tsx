import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';

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
                href={EXTERNAL_LINK.TOP_CREATORS}
                isExternal
                asLink
                className="uppercase"
              >
                Top streamers
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
                href={EXTERNAL_LINK.TOP_DONORS}
                isExternal
                asLink
                className="uppercase"
              >
                Top fans
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
                className="uppercase"
              >
                Token
              </Button>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
