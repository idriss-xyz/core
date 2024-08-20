import { Icon, IconName } from 'shared/ui';

interface FooterLink {
  iconName: IconName;
  href: string;
  text: string;
}

export const Footer = () => {
  const footerLinks: FooterLink[] = [
    {
      href: 'https://docs.idriss.xyz/user-guides/idriss-book#where-can-you-use-the-extension',
      iconName: 'FileTextIcon',
      text: 'Docs',
    },
    {
      href: 'https://discord.gg/RJhJKamjw5',
      iconName: 'DiscordLogoIcon',
      text: 'Discord',
    },
    {
      href: 'https://twitter.com/IDriss_xyz',
      iconName: 'TwitterLogoIcon',
      text: 'Twitter',
    },
  ];

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
