import { ReactNode } from 'react';

import { Icon, IconName } from '@idriss-xyz/ui/icon';

export type TabItem = {
  name: string;
  href: string;
  iconName: IconName;
  isActive?: boolean;
  onClick?: () => void;
};

type TabsPillProperties = {
  tabs: TabItem[];
  renderLink?: (properties: {
    href: string;
    children: ReactNode;
    isActive: boolean;
  }) => ReactNode;
};

export function TabsPill({ tabs, renderLink }: TabsPillProperties) {
  const defaultRenderLink = ({
    href,
    children,
  }: {
    href: string;
    children: ReactNode;
  }) => {
    return <a href={href}>{children}</a>;
  };

  const LinkRenderer = renderLink ?? defaultRenderLink;

  return (
    <div className="flex gap-1">
      <div className="flex gap-1 rounded-full border border-neutral-300 bg-white p-1">
        {tabs.map((tab) => {
          return (
            <LinkRenderer
              key={tab.name}
              href={tab.href}
              isActive={tab.isActive ?? false}
            >
              <div onClick={tab.onClick}>
                {tab.isActive ? (
                  <div className="relative flex h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full border border-[#5FEB3C] bg-white px-8 py-2 text-neutralGreen-900">
                    <Icon name={tab.iconName} size={20} />
                    <span className="relative z-1 max-h-[48] min-h-4.5 min-w-[108] max-w-[138] text-label4 text-black">
                      {tab.name}
                    </span>
                    <span className="absolute top-[16px] h-[36px] w-[200px] rounded-t-[1000px] bg-[#5FEB3C] opacity-30 blur-md" />
                  </div>
                ) : (
                  <div className="group relative flex h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3 hover:border hover:border-[#5FEB3C]">
                    <Icon
                      size={20}
                      name={tab.iconName}
                      className="text-black"
                    />
                    <span className="max-h-[38px] min-h-4.5 w-full text-label4 text-black">
                      {tab.name}
                    </span>
                    <span className="absolute top-[16px] hidden h-[36px] w-[200px] rounded-t-[1000px] bg-[#5FEB3C] opacity-30 blur-md group-hover:inline" />
                  </div>
                )}
              </div>
            </LinkRenderer>
          );
        })}
      </div>
    </div>
  );
}
