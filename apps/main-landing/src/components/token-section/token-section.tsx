'use client';

import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';
import {
  COINMARKETCAP_LINK,
  TOKEN_TERMS_AND_CONDITIONS_LINK,
  TOKENOMICS_DOCS_LINK,
} from '@idriss-xyz/constants';
import { Dropdown } from '@idriss-xyz/ui/dropdown';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';

import { EXTERNAL_LINK } from '@/constants';

import idrissCoin from './assets/IDRISS_COIN 1.png';
import background from './background.png';

export const TokenSection = () => {
  return (
    <div
      className="relative z-40 overflow-visible px-safe lg:h-screen 3xl:h-[unset]"
      id="token"
    >
      <div
        className={classes(
          'container flex flex-col items-center justify-center py-10',
          'md:py-[60px]',
          'lg:py-[116px]',
          '4xl:py-[110px]',
        )}
      >
        <div className="flex flex-col items-center">
          <div
            className={classes(
              'relative flex w-full flex-col items-center gap-[15px] rounded-[36px] bg-white/50 px-4 py-10 backdrop-blur-[45px]',
              'md:px-10 lg:w-[893px]',
              'lg:px-[54px] lg:py-[60px]',
              '2xl:px-10 2xl:pb-[60px] 2xl:pt-10',
              '3xl:px-8',
            )}
          >
            <GradientBorder
              borderRadius={36}
              borderWidth={1}
              gradientDirection="toTop"
              gradientStartColor="#5FEB3C"
              gradientStopColor="rgba(145,206,154,0.50)"
            />
            <link rel="preload" as="image" href={idrissCoin.src} />
            <img
              src={idrissCoin.src}
              alt="IDRISS coin"
              className={classes(
                'mb-6 size-[164px]',
                'lg:size-[200px]',
                '2xl:size-[136px]',
              )}
            />
            <h2
              className={classes(
                'text-heading3 gradient-text',
                'md:text-display4',
                'lg:text-display3',
              )}
            >
              TOKEN
            </h2>
            <p
              className={classes(
                'mb-9 text-balance text-center text-body3 text-neutralGreen-900 opacity-70',
                'lg:text-body2',
                '4xl:text-body',
              )}
            >
              IDRISS is the governance token of{'\u00A0'}IDRISS{'\u00A0'}DAO.
            </p>
            <div className="w-full max-w-[444px] flex-row justify-normal gap-6 lg:flex lg:w-auto lg:max-w-none">
              <div className="flex flex-col gap-6 lg:gap-4">
                <div className="grid grid-cols-1 items-center justify-center gap-6 lg:grid-cols-[444px,210px]">
                  <GeoConditionalButton
                    defaultButton={[
                      <Button
                        key="uniswap"
                        intent="primary"
                        size="large"
                        prefixIconName="Uniswap"
                        asLink
                        href="https://app.uniswap.org/swap?inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x000096630066820566162C94874A776532705231"
                        isExternal
                        className="w-full"
                      >
                        BUY ON UNISWAP
                      </Button>,
                      <Button
                        key="jumper"
                        intent="primary"
                        size="large"
                        prefixIconName="Jumper"
                        asLink
                        href="https://jumper.exchange/?fromChain=8453&fromToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toChain=8453&toToken=0x000096630066820566162C94874A776532705231"
                        isExternal
                        className="w-full whitespace-nowrap"
                      >
                        BUY ON JUMPER
                      </Button>,
                    ]}
                  />
                  <Dropdown
                    className="z-extensionPopup min-w-60 rounded-xl border border-neutral-300 bg-white py-2 shadow-lg"
                    contentAlign="end"
                    trigger={({ isOpened }) => {
                      return (
                        <Button
                          size="large"
                          intent="secondary"
                          className="w-full"
                          suffixIconName="ChevronDown"
                          suffixIconClassName={`transition-all duration-200 ease-in-out ${isOpened ? 'rotate-[180deg]' : ''}`}
                        >
                          MORE
                        </Button>
                      );
                    }}
                  >
                    {() => {
                      return (
                        <ul className="flex flex-col gap-y-1">
                          <li>
                            <Button
                              className="w-full justify-start px-3 py-1 font-normal text-neutral-900"
                              intent="tertiary"
                              size="large"
                              prefixIconName="ChartPie"
                              prefixIconClassName="mr-3"
                              href={TOKENOMICS_DOCS_LINK}
                              asLink
                            >
                              Tokenomics
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="w-full justify-start px-3 py-1 font-normal text-neutral-900"
                              intent="tertiary"
                              size="large"
                              prefixIconName="CoinmarketcapOutlined"
                              prefixIconClassName="mr-3"
                              href={COINMARKETCAP_LINK}
                              isExternal
                              asLink
                            >
                              Coinmarketcap
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="w-full justify-start px-3 py-1 font-normal text-neutral-900"
                              intent="tertiary"
                              size="large"
                              prefixIconName="Vault"
                              prefixIconClassName="mr-3"
                              href={EXTERNAL_LINK.VAULT}
                              asLink
                            >
                              Vault
                            </Button>
                          </li>
                        </ul>
                      );
                    }}
                  </Dropdown>
                </div>
                <div className="self-stretch text-center opacity-70">
                  <span
                    className={classes(
                      'text-body5 text-neutralGreen-900',
                      'md:text-body5',
                    )}
                  >
                    By purchasing, you agree to the{' '}
                  </span>
                  <Link
                    size="medium"
                    href={TOKEN_TERMS_AND_CONDITIONS_LINK}
                    isExternal
                    className={classes(
                      'text-body5',
                      'md:text-body5',
                      //lg here is intentional to override the Link variant style
                      'lg:text-body5',
                    )}
                  >
                    Terms{'\u00A0'}and{'\u00A0'}conditions
                  </Link>
                </div>
                <div className="flex justify-center" />
              </div>
            </div>
          </div>
          <img
            src={background.src}
            className="pointer-events-none absolute left-0 top-0 -z-10 size-full overflow-visible object-cover"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
