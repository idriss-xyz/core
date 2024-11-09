import { CreatorsSection } from './creators-section';
import { ExtensionSection } from './extension-section';
import { PredictionMarketsSection } from './prediction-markets-section';

type Properties = {
  className?: string;
};

export const MobileProductsSection = ({ className }: Properties) => {
  return (
    <>
      <section className={className} id="extension-product">
        <ExtensionSection fadeOut={false} />
      </section>
      <section className={className} id="creators-product">
        <CreatorsSection fadeOut={false} />
      </section>
      <section className={className} id="prediction-markets-product">
        <PredictionMarketsSection fadeOut={false} />
      </section>
    </>
  );
};
