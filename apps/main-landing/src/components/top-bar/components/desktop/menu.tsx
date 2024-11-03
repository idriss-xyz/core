import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import Link from 'next/link';

import { APPS_SECTION_NAVIGATION_ITEMS } from '../../constants';
import { Section } from '../section';

export const Menu = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex space-x-10">
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger asChild>
            <Button intent="tertiary" size="large" suffixIconName="ChevronDown">
              APPS
            </Button>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-[-128px] w-max">
            <Section
              className="relative z-navigationMenu rounded-[24px] bg-white p-8"
              items={APPS_SECTION_NAVIGATION_ITEMS}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Link href="/#" passHref legacyBehavior>
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
              <Link href="/#" passHref legacyBehavior>
                <Button intent="tertiary" size="large" asLink>
                  DOCS
                </Button>
              </Link>
            </span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
