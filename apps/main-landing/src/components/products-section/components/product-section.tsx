/* eslint-disable @next/next/no-img-element */
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
    <div
      className={classes(
        'flex size-full overflow-hidden bg-mint-100',
        className,
      )}
    >
      <div
        className={classes(
          'flex size-full flex-col overflow-hidden bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] px-4 transition-[border-radius] duration-150 will-change-[border-radius]',
          'lg:px-[120px] lg:pt-20',
          '2xl:px-[112px] 2xl:py-20',
        )}
        style={style}
      >
        <div
          className={classes(
            'container flex flex-col gap-10 p-0',
            'lg:gap-[104px] lg:[@media(max-height:1000px)]:gap-[30px] lg:[@media(max-height:770px)]:gap-[24px] lg:[@media(min-height:1001px)]:[@media(max-height:1100px)]:gap-[50px]',
          )}
        >
          {properties.animated ? (
            <ImageSequencer
              infinite={false}
              images={properties.animationImages}
              direction={properties.animationDirection}
              startIndex={properties.animationStartIndex}
              endIndex={properties.animationEndIndex}
              className={classes(
                'bottom-0 right-0 top-1/2 z-0',
                'lg:absolute lg:max-w-[45%] lg:-translate-y-1/2',
                '2xl:right-[-220px] 2xl:top-[400px] 2xl:w-[780px] 2xl:max-w-[unset]',
              )}
            />
          ) : (
            <img
              src={properties.circleImage}
              alt=""
              className={classes(
                'bottom-0 right-0 top-1/2 z-0 m-auto w-[320px] translate-y-[-15%]',
                'md:w-[450px] md:translate-y-0',
                'lg:absolute lg:max-w-[45%] lg:-translate-y-1/2 lg:[@media(max-width:1540px)]:[@media(max-height:1000px)]:translate-y-[-30%] lg:[@media(min-height:1300px)]:-translate-y-full',
                '[@media(min-width:1001px)]:[@media(min-height:800px)]:[@media(max-height:1100px)]:translate-y-[-40%]',
              )}
            />
          )}
          <div
            className={classes(
              'flex flex-col items-start gap-[64px]',
              'md:gap-10',
              'left-[112px] w-screen lg:absolute',
              '2xl:gap-6',
            )}
          >
            {tabsVisibile && (
              <Tabs
                options={tabOptions}
                activeOptionKey={activeOptionKey}
                asLink={tabsAsLinks}
              />
            )}
            <div
              className={classes(
                'z-1 flex flex-col gap-4',
                '2xl:w-[730px] 2xl:gap-2',
              )}
            >
              <div className="z-1 overflow-hidden">
                <h2
                  className={classes(
                    'text-balance pt-20 text-display5 text-midnightGreen-100 transition-transform duration-1000',
                    'md:text-display4',
                    'lg:pt-0',
                    '2xl:text-display3',
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
                    'text-balance text-body3 text-midnightGreen-200 transition-transform duration-1000',
                    '[@media(min-width:1541px)]:text-body2',
                    '2xl:text-body3',
                    fadeOut && 'translate-y-[-120%]',
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
            <div className="w-full overflow-hidden p-1 lg:w-fit">
              <div
                className={classes(
                  'flex flex-col items-center gap-3 transition-transform duration-1000',
                  'md:flex-row',
                  'lg:gap-4',
                  fadeOut && 'translate-y-[-120%]',
                )}
              >
                {actions}
              </div>
            </div>

            <div className="z-1 mx-auto mt-[-80px] overflow-hidden md:mt-0 lg:mx-0">
              <div
                className={classes(
                  'grid size-fit flex-wrap items-start gap-6 p-1.5 pb-10 transition-transform duration-1000',
                  'md:grid-cols-2',
                  'lg:grid-cols-2 lg:pb-[80px]',
                  '[@media(max-height:1100px)]:pb-[30px]',
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
                          className="size-10 text-[#55EB3C] lg:size-[57.14px]"
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
