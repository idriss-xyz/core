import { ProductTile } from './components/product-tile';
import { StackedHex } from './components/stacked-hex';
import { TopWave } from './components/top-wave';
import { productTilesContent } from './constans';

export const SuperpowersSection = () => {
  return (
    <section className="relative bg-mint-100 pb-20">
      <TopWave className="absolute left-0 top-0 z-0 w-full translate-y-[-15%] text-white" />
      <StackedHex className="absolute bottom-0 right-0 hidden translate-x-[-5%] lg:block" />
      <div className="container relative z-1 lg:flex lg:flex-col lg:items-center">
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
          {productTilesContent.map((point) => {
            return (
              <ProductTile
                key={point.productName}
                productName={point.productName}
                tileTitle={point.tileTitle}
                tileListPoints={point.tilePoints}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
