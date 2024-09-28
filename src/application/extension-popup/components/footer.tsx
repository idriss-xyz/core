import { Icon } from 'shared/ui';

import { footerLinks } from '../constants';

export const Footer = () => {
  return (
    <footer className="grid grid-cols-3 divide-x divide-gray-900/5 bg-white drop-shadow-2xl">
      {footerLinks.map((link) => {
        return (
          <a
            key={link.iconName}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-x-2 p-3 font-medium text-gray-900 hover:bg-gray-50"
          >
            <Icon name={link.iconName} className="text-[#9fa2ae]" />
            {link.text}
          </a>
        );
      })}
    </footer>
  );
};
