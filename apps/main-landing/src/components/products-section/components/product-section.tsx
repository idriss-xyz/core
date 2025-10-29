/* eslint-disable @next/next/no-img-element */
'use client';
import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { ReactNode } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { ImageSequencer } from '@/components/image-sequencer';

import { ProductInfo } from './product-info';

type ProductSectionProperties = {
  activeOptionKey: string;
  title: string;
  description: string;
  actions: ReactNode;
  features: ProductSectionFeature[];
  className?: string;
  headerClassName?: string;
  fadeOut: boolean;
  marginX?: number;
  marginY?: number;
  borderRadius?: number;
} & (
  | {
      animated: true;
      animationStartIndex: number;
      animationEndIndex: number;
      animationDirection: 'forward' | 'backward';
      animationImages: string[];
      animationFps?: number;
      placeholderImage: string;
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
  fadeOut,
  borderRadius,
  marginX,
  marginY,
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
          'relative flex size-full flex-col overflow-hidden bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] px-4 will-change-[border-radius,margin]',
          'lg:px-0',
        )}
        style={{
          margin: `${marginY}px ${marginX}px`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <div
          className={classes(
            'container flex flex-col gap-10 p-0',
            'lg:gap-[104px]',
          )}
        >
          <div
            className={classes(
              'flex flex-col items-start gap-[64px] px-safe',
              'md:gap-10',
              'lg:absolute lg:left-0 lg:top-0 lg:h-screen lg:w-screen lg:pt-10 lg:will-change-[margin-left]',
              '2xl:gap-6',
              '3xl:gap-10',
              '4xl:z-0',
            )}
            style={
              marginX === undefined
                ? {}
                : {
                    marginLeft: `${112 - (marginX ?? 0) / 2}px`,
                  }
            }
          >
            <div
              className={classes(
                'z-1 flex flex-col gap-4',
                'lg:w-[800px]',
                '2xl:gap-2',
              )}
            >
              <div className="z-1 overflow-hidden">
                <h2
                  className={classes(
                    'text-balance pt-20 text-display5 text-midnightGreen-100 transition-transform duration-1000',
                    'sm:text-center',
                    'md:text-display4',
                    'lg:pt-0 lg:text-start',
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
                    'text-balance text-body2 text-midnightGreen-200 transition-transform duration-1000',
                    'sm:text-center',
                    'lg:text-start',
                    '2xl:text-body3',
                    '4xl:text-body2',
                    fadeOut && 'translate-y-[-120%]',
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
            <div
              className={classes(
                'w-full overflow-hidden p-1',
                'lg:w-fit',
                '2xl:pb-[16px]',
                '3xl:pb-5',
              )}
            >
              <div
                className={classes(
                  'flex flex-col items-center gap-3 transition-transform duration-1000',
                  'md:flex-row md:justify-center',
                  'lg:gap-4',
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
                fps={properties.animationFps}
                direction={properties.animationDirection}
                startIndex={properties.animationStartIndex}
                endIndex={properties.animationEndIndex}
                placeholderImage={properties.placeholderImage}
                className={classes(
                  'bottom-0 right-0 top-1/2 z-0',
                  'lg:absolute lg:top-[10px] lg:max-w-[45%]',
                  '2xl:right-[-40px] 2xl:w-[780px] 2xl:max-w-[unset]',
                  '3xl:right-16',
                  '4xl:right-28 4xl:w-[970px]',
                  //iPadPro
                  '[@media(width:1024px)]:[@media(height:1366px)]:left-[20%] [@media(width:1024px)]:[@media(height:1366px)]:top-[60%]',
                )}
              />
            ) : (
              <img
                src={properties.circleImage}
                alt=""
                className={classes(
                  'bottom-0 right-0 top-1/2 z-0 m-auto w-[320px] translate-y-[-15%]',
                  'md:w-[550px] md:translate-y-0',
                  'lg:absolute lg:max-w-[45%] lg:-translate-y-1/2',
                )}
              />
            )}
            <div className="z-1 mx-auto mt-[-80px] overflow-hidden md:mt-0 lg:mx-0">
              <div
                className={classes(
                  'grid size-fit flex-wrap items-start gap-6 p-1.5 pb-10 transition-transform duration-1000',
                  'md:grid-cols-2',
                  'lg:grid-cols-2 lg:pb-[80px]',

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
                          className="size-10 text-[#55EB3C] md:size-[57.14px]"
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
