import { ReactNode } from 'react';

import { Icon, IconName } from '@idriss-xyz/ui/icon';

import { classes } from '../../utils';

export type TabItem = {
  name: string;
  href?: string;
  iconName: IconName;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  subtitle?: string;
  showPulsingDot?: boolean;
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
          if (tab.disabled) {
            return (
              <div
                key={tab.name}
                className="relative flex h-[40px] cursor-not-allowed items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent px-6 py-2"
              >
                <Icon
                  size={20}
                  name={tab.iconName}
                  className="text-neutral-900"
                />
                <div className="flex min-w-[108] max-w-[138] flex-col items-start">
                  <span className={classes('text-label4 text-neutral-900')}>
                    {tab.name}
                  </span>
                  {tab.subtitle && (
                    <span className={classes('text-label6 text-mint-600')}>
                      {tab.subtitle}
                    </span>
                  )}
                </div>
                {tab.showPulsingDot && (
                  <div
                    className={classes(
                      'absolute bottom-1 left-1/2 size-2 -translate-x-1/2 animate-pulse rounded-full bg-mint-600',
                    )}
                  />
                )}
              </div>
            );
          }
          return (
            <LinkRenderer
              key={tab.name}
              href={tab.href!}
              isActive={tab.isActive ?? false}
            >
              <div onClick={tab.onClick}>
                {tab.isActive ? (
                  <div
                    className={classes(
                      'relative flex h-[40px] items-center justify-center gap-2 overflow-hidden rounded-full border border-[#5FEB3C] bg-white px-6 py-2 text-neutralGreen-900',
                    )}
                  >
                    <Icon name={tab.iconName} size={20} />
                    <div
                      className={classes(
                        'relative z-1 flex min-w-[108] max-w-[138] flex-col items-start',
                      )}
                    >
                      <span className={classes('text-label4 text-neutral-900')}>
                        {tab.name}
                      </span>
                      {tab.subtitle && (
                        <span className={classes('text-label6 text-mint-600')}>
                          {tab.subtitle}
                        </span>
                      )}
                    </div>
                    <span className="absolute top-[16px] h-[36px] w-[200px] rounded-t-[1000px] bg-[#5FEB3C] opacity-30 blur-md" />
                    {tab.showPulsingDot && (
                      <div
                        className={classes(
                          'absolute bottom-1 left-1/2 size-2 -translate-x-1/2 animate-pulse rounded-full bg-mint-600',
                        )}
                      />
                    )}
                  </div>
                ) : (
                  <div className="group relative flex h-[40px] items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent px-6 py-2 hover:border-[#5FEB3C]">
                    <Icon
                      size={20}
                      name={tab.iconName}
                      className="text-neutral-900"
                    />
                    <div
                      className={classes(
                        'relative z-1 flex min-w-[108] max-w-[138] flex-col items-start',
                      )}
                    >
                      <span className={classes('text-label4 text-neutral-900')}>
                        {tab.name}
                      </span>
                      {tab.subtitle && (
                        <span className={classes('text-label6 text-mint-600')}>
                          {tab.subtitle}
                        </span>
                      )}
                    </div>
                    <span className="absolute top-[16px] hidden h-[36px] w-[200px] rounded-t-[1000px] bg-[#5FEB3C] opacity-30 blur-md group-hover:inline" />
                    {tab.showPulsingDot && (
                      <div
                        className={classes(
                          'absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 animate-pulse rounded-full bg-mint-600',
                        )}
                      />
                    )}
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
