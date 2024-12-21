import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';
import {
  CHROME_EXTENSION_LINK,
  CREATORS_LINK,
  EXTENSION_USER_GUIDE_LINK,
} from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';

import { ProductTile } from './components/product-tile';
import { TopWave } from './components/top-wave';
import {
  CREATORS_INFO,
  EXTENSION_INFO,
  PREDICTION_MARKETS_INFO,
} from './constans';
import { stackedHex } from './assets';

export const SuperpowersSection = () => {
  return (
    <section className="relative bg-mint-100" id="apps">
      <TopWave className="absolute left-0 top-0 z-0 w-full translate-y-[-12%] text-white" />
      <div className="relative overflow-hidden">
        <Image
          priority
          src={stackedHex}
          alt=""
          className={classes(
            'absolute hidden',
            'md:right-0 md:top-24 md:block md:translate-x-1/2',
            'lg:bottom-0 lg:right-0 lg:translate-x-[10%] lg:translate-y-[10%]',
          )}
        />

        <div className="container relative z-1 pb-28 4xl:pb-32 lg:flex lg:flex-col lg:items-center">
          <div className="mb-10 flex w-full flex-col items-center gap-4 lg:mb-20">
            <h2
              className={classes(
                'mt-20 text-center text-display5 gradient-text',
                'md:text-display4',
                'lg:mt-[60px] lg:text-display3',
              )}
            >
              SUPERPOWERS FOR YOUR INTERNET
            </h2>
            <p
              className={classes(
                'max-w-[940px] text-balance text-center text-body3 text-neutralGreen-900 opacity-70',
                'lg:text-body2',
                '4xl:text-body1',
              )}
            >
              Our apps bring the power of crypto and AI to your browsing
              experience, empower creators through digital ownership, and help
              find what’s true on the internet.
            </p>
          </div>
          <div
            className={classes(
              'flex flex-col items-start justify-center gap-6',
              'md:grid md:grid-cols-[minmax(auto,_600px)] md:grid-rows-[repeat(3,1fr)]',
              'lg:grid-cols-[repeat(3,_minmax(auto,_431px))] lg:grid-rows-1 lg:flex-row',
            )}
          >
            <ProductTile
              {...EXTENSION_INFO}
              actions={
                <>
                  <Button
                    intent="primary"
                    size="large"
                    suffixIconName="IdrissArrowRight"
                    asLink
                    href={CHROME_EXTENSION_LINK}
                    isExternal
                    className="w-full"
                  >
                    DOWNLOAD
                  </Button>
                  <Button
                    intent="secondary"
                    size="large"
                    asLink
                    href={EXTENSION_USER_GUIDE_LINK}
                    isExternal
                    className="w-full"
                  >
                    LEARN MORE
                  </Button>
                </>
              }
            />
            <ProductTile
              {...CREATORS_INFO}
              actions={
                <>
                  <Button
                    intent="primary"
                    size="large"
                    suffixIconName="IdrissArrowRight"
                    className="w-full"
                    asLink
                    href={CREATORS_LINK}
                    isExternal
                  >
                    CREATE DONATION LINK
                  </Button>
                </>
              }
            />
            <ProductTile
              {...PREDICTION_MARKETS_INFO}
              actions={
                <>
                  <Button
                    intent="secondary"
                    disabled
                    size="large"
                    className="w-full"
                  >
                    COMING SOON
                  </Button>
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};
