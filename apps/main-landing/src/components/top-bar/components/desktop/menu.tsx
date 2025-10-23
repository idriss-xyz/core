import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import Link from 'next/link';
import { DOCUMENTATION_LINK } from '@idriss-xyz/constants';

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
              <Link href={INTERNAL_LINK.CREATORS} passHref legacyBehavior>
                <Button intent="tertiary" size="large" asLink>
                  APP
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Link href={INTERNAL_LINK.TOKEN} passHref legacyBehavior>
                <Button intent="tertiary" size="large" asLink>
                  TOKEN
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Link href={EXTERNAL_LINK.VAULT} passHref legacyBehavior>
                <Button intent="tertiary" size="large" asLink>
                  VAULT
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Button
                intent="tertiary"
                size="large"
                href={DOCUMENTATION_LINK}
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
