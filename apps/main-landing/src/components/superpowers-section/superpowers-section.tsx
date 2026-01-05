import { classes } from '@idriss-xyz/ui/utils';

import { ProductTile } from './components/product-tile';
import { TopWave } from './components/top-wave';
import { DAO_INFO, APP_INFO } from './constans';
import { stackedHex } from './assets';

export const SuperpowersSection = () => {
  return (
    <section className="relative bg-mint-100" id="apps">
      <TopWave className="absolute left-0 top-0 z-0 w-full translate-y-[-12%] text-white" />
      <div className="relative overflow-hidden">
        <link rel="preload" as="image" href={stackedHex.src} />
        <img
          src={stackedHex.src}
          alt=""
          className={classes(
            'absolute hidden',
            'md:right-0 md:top-24 md:block md:translate-x-1/2',
            'lg:bottom-0 lg:right-0 lg:translate-x-[10%] lg:translate-y-[10%]',
          )}
        />
        <div className="z-1 px-safe">
          <div className="container relative pb-28 lg:flex lg:flex-col lg:items-center 4xl:pb-32">
            <div className="mb-10 flex w-full flex-col items-center gap-4 lg:mb-20">
              <h2
                className={classes(
                  'mt-20 text-center text-display5 gradient-text',
                  'md:text-display4',
                  'lg:mt-[60px] lg:text-display3',
                )}
              >
                TWO PARTS
                <span className="hidden md:inline"> </span>
                <br className="md:hidden" />
                BUT ONE MISSION
              </h2>
              <p
                className={classes(
                  'max-w-[940px] text-balance text-center text-body3 text-neutralGreen-900 opacity-70',
                  'lg:text-body2',
                  '4xl:text-body1',
                )}
              >
                Helping streamers earn more onchain.
              </p>
            </div>
            <div
              className={classes(
                'flex flex-col items-start justify-center gap-6',
                'md:grid md:grid-cols-[minmax(auto,_600px)] md:grid-rows-[repeat(3,1fr)]',
                'lg:grid-cols-[repeat(2,_minmax(auto,_646px))] lg:grid-rows-1 lg:flex-row',
              )}
            >
              <ProductTile {...APP_INFO} />
              <ProductTile {...DAO_INFO} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
