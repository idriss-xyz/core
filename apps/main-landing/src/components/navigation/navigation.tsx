import Image from 'next/image';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import Link from 'next/link';

import { NavigationContent } from './components';

export const Navigation = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="container flex items-center justify-between px-4 py-1 lg:py-3">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/">
              <Image
                src="/logo-idriss-dark.png"
                height={24}
                width={98}
                alt=""
                priority
              />
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationContent />
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
