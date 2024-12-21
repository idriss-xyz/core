import { Button } from '@idriss-xyz/ui/button';
import {
  CHROME_EXTENSION_LINK,
  CREATORS_LINK,
  EXTENSION_USER_GUIDE_LINK,
} from '@idriss-xyz/constants';

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
    <section className="relative bg-mint-100 pb-20" id="apps">
      <TopWave className="absolute left-0 top-0 z-0 w-full translate-y-[-15%] text-white" />
      <img
        src={stackedHex.src}
        alt=""
        className="absolute bottom-0 right-0 hidden translate-x-[-5%] lg:block"
      />
      <div className="z-1 px-safe">
        <div className="container relative lg:flex lg:flex-col lg:items-center">
          <div className="mb-10 flex w-full flex-col items-center gap-4 lg:mb-20">
            <h2 className="mt-20 text-center text-display5 gradient-text lg:mt-10 lg:text-display2">
              SUPERPOWERS FOR YOUR INTERNET
            </h2>
            <p className="max-w-[940px] text-center text-body3 text-neutralGreen-900 opacity-70 lg:text-body1">
              Our apps bring the power of crypto and AI to your browsing
              experience, empower creators through digital ownership, and help
              find what’s true on the internet.
            </p>
          </div>
          <div className="flex flex-col items-start justify-center gap-6 lg:grid lg:grid-cols-[repeat(3,_minmax(auto,_431px))] lg:flex-row">
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
                  >
                    DOWNLOAD
                  </Button>
                  <Button
                    intent="secondary"
                    size="large"
                    asLink
                    href={EXTENSION_USER_GUIDE_LINK}
                    isExternal
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
