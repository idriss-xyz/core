import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';

import { CollaborationsShowcase } from './components';
import { backgroundLines, tokensFlow } from './assets';

export const HeroSection = () => {
  return (
    <header className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] pt-[104px] lg:bg-[radial-gradient(222.94%_366.93%_at_16.62%_20%,_#E7F5E7_0%,_#76C282_100%)] lg:pt-[200px]">
      <Image
        priority
        src={backgroundLines}
        className="absolute top-0 hidden opacity-40 lg:block"
        alt=""
      />
      <h1 className="container z-1 my-0 text-balance text-center text-display4 font-normal gradient-text lg:text-display1">
        APPS UNIQUELY ENABLED BY CRYPTO AND AI
      </h1>
      <Button
        aria-label="Get started"
        intent="primary"
        size="large"
        className="z-1 my-9 lg:mb-0 lg:mt-9"
        suffixIconName="IdrissArrowRight"
      >
        EXPLORE
      </Button>
      <Image
        priority
        src={tokensFlow}
        className="z-0 mt-[-22%] w-full min-w-[500px] md:mt-[-18%] lg:mt-[-15%]"
        alt=""
      />
      <CollaborationsShowcase className="container mt-9 text-center lg:my-20" />
    </header>
  );
};
