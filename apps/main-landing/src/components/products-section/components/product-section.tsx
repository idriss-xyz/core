'use client';
import Image from 'next/image';
import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { CSSProperties, ReactNode } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { tabOptions } from '../constants';
import { circleWithScreen } from '../assets';

import { ProductInfo } from './product-info';
import { Tabs } from './tabs';

type ProductSectionProperties = {
  activeOptionKey: string;
  title: string;
  description: string;
  actions: ReactNode;
  features: ProductSectionFeature[];
  tabsAsLinks: boolean;
  className?: string;
  fadeOut: boolean;
  style?: CSSProperties;
};
type ProductSectionFeature = {
  icon: IconName;
  title: string;
  description?: string;
};
export type ProductSectionInfo = {
  title: string;
  description: string;
  features: ProductSectionFeature[];
};

export const ProductSection = ({
  className,
  activeOptionKey,
  title,
  description,
  actions,
  features,
  tabsAsLinks,
  fadeOut,
  style,
}: ProductSectionProperties) => {
  return (
    <div className={classes('relative flex size-full bg-mint-100', className)}>
      <div
        className="flex size-full flex-col bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] px-4 py-10 transition-[border-radius] duration-150 will-change-[border-radius] lg:px-[120px] lg:py-[80px] [@media(max-height:1100px)]:py-[30px]"
        style={style}
      >
        <div className="container flex flex-col gap-10 p-0 lg:gap-[104px] lg:[@media(max-height:1100px)]:gap-[50px] lg:[@media(max-height:770px)]:gap-[24px]">
          <div className="flex flex-col items-start gap-[64px] lg:[@media(max-height:1100px)]:gap-[50px] lg:[@media(max-height:770px)]:gap-[24px]">
            <Tabs
              options={tabOptions}
              activeOptionKey={activeOptionKey}
              asLink={tabsAsLinks}
            />
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden">
                <h2
                  className={classes(
                    'text-balance text-display5 text-midnightGreen-100 transition-transform duration-1000 [@media(min-width:1181px)]:text-display2',
                    fadeOut && 'translate-y-[-120%]',
                  )}
                >
                  {title}
                </h2>
              </div>
              <div className="overflow-hidden">
                <p
                  className={classes(
                    'text-balance text-body3 text-midnightGreen-200 transition-transform duration-1000 lg:w-[60%] [@media(min-width:1181px)]:text-body2',
                    fadeOut && 'translate-y-[-120%]',
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
            <div className="w-full overflow-hidden p-1 md:w-fit lg:w-fit">
              <div
                className={classes(
                  'flex flex-col items-center gap-3 transition-transform duration-1000 md:flex-row lg:flex-row lg:gap-4',
                  fadeOut && 'translate-y-[-120%]',
                )}
              >
                {actions}
              </div>
            </div>
            <Image
              priority
              src={circleWithScreen}
              alt=""
              className="bottom-0 right-0 top-1/2 lg:absolute lg:max-w-[45%] lg:-translate-y-1/2 lg:[@media(max-width:1400px)]:translate-y-[-40%] lg:[@media(min-height:1300px)]:-translate-y-full"
            />
          </div>
          <div className="overflow-hidden">
            <div
              className={classes(
                'grid size-fit flex-wrap items-start gap-6 p-1.5 transition-transform duration-1000 md:grid-cols-2 lg:grid-cols-2',
                fadeOut && 'translate-y-[-120%]',
              )}
            >
              {features.map((feature) => {
                return (
                  <ProductInfo
                    key={feature.title}
                    icon={
                      <Icon
                        name={feature.icon}
                        size={65}
                        className="size-10 text-[#55EB3C] lg:size-[65px]"
                      />
                    }
                    title={feature.title}
                    description={feature.description}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
