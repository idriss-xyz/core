import { CreatorsSection } from './creators-section';
import { ExtensionSection } from './extension-section';
import { PredictionMarketsSection } from './prediction-markets-section';

type Properties = {
  className?: string;
};

export const MobileProductsSection = ({ className }: Properties) => {
  return (
    <>
      <section className={className} id="extension">
        <ExtensionSection fadeOut={false} />
      </section>
      <section className={className} id="creators">
        <CreatorsSection fadeOut={false} />
      </section>
      <section className={className} id="prediction-markets">
        <PredictionMarketsSection fadeOut={false} />
      </section>
    </>
  );
};
