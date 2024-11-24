'use client';
import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { CSSProperties, ReactNode } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { ImageSequencer } from '@/components/image-sequencer';

import { tabOptions } from '../constants';

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
  headerClassName?: string;
  fadeOut: boolean;
  tabsVisibile?: boolean;
  style?: CSSProperties;
} & (
  | {
      animated: true;
      animationStartIndex: number;
      animationEndIndex: number;
      animationDirection: 'forward' | 'backward';
      animationImages: string[];
    }
  | {
      animated: false;
      circleImage: string;
    }
);

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
  headerClassName,
  activeOptionKey,
  title,
  description,
  actions,
  features,
  tabsAsLinks,
  fadeOut,
  style,
  tabsVisibile = true,
  ...properties
}: ProductSectionProperties) => {
  return (
    <div className={classes('relative flex size-full bg-mint-100', className)}>
      <div
        className="flex size-full flex-col bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] px-4 transition-[border-radius] duration-150 will-change-[border-radius] lg:px-[120px] lg:pt-[80px] lg:[@media(max-height:1100px)]:pt-[30px]"
        style={style}
      >
        <div className="container flex flex-col gap-10 p-0 lg:gap-[104px] lg:[@media(max-height:1000px)]:gap-[30px] lg:[@media(max-height:770px)]:gap-[24px] lg:[@media(min-height:1001px)]:[@media(max-height:1100px)]:gap-[50px]">
          <div className="flex flex-col items-start gap-[64px] lg:[@media(max-height:1100px)]:gap-[50px]">
            {tabsVisibile && (
              <Tabs
                options={tabOptions}
                activeOptionKey={activeOptionKey}
                asLink={tabsAsLinks}
              />
            )}
            <div className="z-1 flex flex-col gap-4">
              <div className="z-1 overflow-hidden">
                <h2
                  className={classes(
                    'text-balance pt-16 text-display5 text-midnightGreen-100 transition-transform duration-1000 lg:pt-0 [@media(max-width:1440px)]:[@media(max-height:1000px)]:text-display4 [@media(min-width:1441px)]:text-display2',
                    headerClassName,
                    fadeOut && 'translate-y-[-120%]',
                  )}
                >
                  {title}
                </h2>
              </div>
              <div className="z-1 overflow-hidden">
                <p
                  className={classes(
                    'text-balance text-body3 text-midnightGreen-200 transition-transform duration-1000 lg:w-[60%] [@media(max-width:1440px)]:[@media(max-height:1000px)]:text-body4 [@media(min-width:1441px)]:text-body2',
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
            {properties.animated ? (
              <ImageSequencer
                infinite={false}
                images={properties.animationImages}
                direction={properties.animationDirection}
                startIndex={properties.animationStartIndex}
                endIndex={properties.animationEndIndex}
                className="bottom-0 right-0 top-1/2 z-0 lg:absolute lg:max-w-[45%] lg:-translate-y-1/2 lg:[@media(max-width:1440px)]:[@media(max-height:1000px)]:translate-y-[-30%] lg:[@media(min-height:1300px)]:-translate-y-full [@media(min-width:1001px)]:[@media(min-height:800px)]:[@media(max-height:1100px)]:translate-y-[-40%]"
              />
            ) : (
              <img
                src={properties.circleImage}
                alt=""
                className="bottom-0 right-0 top-1/2 z-0 lg:absolute lg:max-w-[45%] lg:-translate-y-1/2 lg:[@media(max-width:1440px)]:[@media(max-height:1000px)]:translate-y-[-30%] lg:[@media(min-height:1300px)]:-translate-y-full [@media(min-width:1001px)]:[@media(min-height:800px)]:[@media(max-height:1100px)]:translate-y-[-40%]"
              />
            )}
            <div className="z-1 overflow-hidden">
              <div
                className={classes(
                  'grid size-fit flex-wrap items-start gap-6 p-1.5 pb-10 transition-transform duration-1000 md:grid-cols-2 lg:grid-cols-2 lg:pb-[80px] [@media(max-height:1100px)]:pb-[30px]',
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
    </div>
  );
};
