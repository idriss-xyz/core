import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import Link from 'next/link';

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
              <Link href={EXTERNAL_LINK.TOP_CREATORS} passHref legacyBehavior>
                <Button
                  intent="tertiary"
                  size="large"
                  asLink
                  className="uppercase"
                >
                  Top streamers
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Link href={EXTERNAL_LINK.TOP_DONORS} passHref legacyBehavior>
                <Button
                  intent="tertiary"
                  size="large"
                  asLink
                  className="uppercase"
                >
                  Top fans
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Link href={INTERNAL_LINK.TOKEN} passHref legacyBehavior>
                <Button
                  intent="tertiary"
                  size="large"
                  asLink
                  className="uppercase"
                >
                  Token
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
