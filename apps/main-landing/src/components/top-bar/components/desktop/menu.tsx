import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import Link from 'next/link';
import { DOCUMENTATION_LINK } from '@idriss-xyz/constants';

import { INTERNAL_LINK } from '@/constants';

import { APPS_SECTION_NAVIGATION_ITEMS } from '../../constants';
import { Section } from '../section';

type Properties = {
  className?: string;
};

export const Menu = ({ className }: Properties) => {
  return (
    <NavigationMenu.Root className={className}>
      <NavigationMenu.List className="flex space-x-10">
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger asChild>
            <Button intent="tertiary" size="large" suffixIconName="ChevronDown">
              APPS
            </Button>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-[-128px] w-max">
            <Section
              className="rounded-[24px] bg-white p-8 [box-shadow:0px_32px_64px_0px_#00000026,_0px_1px_3px_0px_#0000001A]"
              items={APPS_SECTION_NAVIGATION_ITEMS}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <span>
              <Link href={INTERNAL_LINK.DAO} passHref legacyBehavior>
                <Button intent="tertiary" size="large" asLink>
                  DAO
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
