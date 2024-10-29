import Link from 'next/link';
import { classes } from '@idriss-xyz/ui/utils';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';

import { NavigationSectionItem } from '../types';

type Properties = {
  items?: NavigationSectionItem[];
  className?: string;
  onItemClick?: () => void;
};

export const Section = ({ onItemClick, className, items = [] }: Properties) => {
  return (
    <ul className={classes('space-y-6', className)}>
      {items.map((item, index) => {
        return (
          <li key={index} className="group">
            <NavigationMenu.Link asChild>
              <span>
                <Link href="/#" passHref legacyBehavior>
                  <a onClick={onItemClick} className="block">
                    <span className="block text-button2 group-hover:text-mint-600">
                      {item.title}
                    </span>
                    <p className="text-body4 opacity-60">{item.description}</p>
                  </a>
                </Link>
              </span>
            </NavigationMenu.Link>
          </li>
        );
      })}
    </ul>
  );
};
