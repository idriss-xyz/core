'use client';
import { Link } from '@idriss-xyz/ui/link';
import Image from 'next/image';
import { Button } from '@idriss-xyz/ui/button';
import {
  CHROME_EXTENSION_LINK,
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
} from '@idriss-xyz/constants';

import idrissHalfTransparent from './idriss-half-transparent.png';
import { Section } from './components';
import { EXTERNAL_RESOURCES, INTERNAL_LINKS, SOCIALS } from './constants';

export const Footer = () => {
  return (
    <footer className="relative z-1 overflow-x-hidden bg-mint-100 p-2.5 lg:p-0">
      <div className="px-safe">
        <div className="container pt-20 lg:grid lg:grid-cols-2 lg:gap-6 lg:pb-40">
          <div className="flex flex-col items-start">
            <h2 className="text-balance text-display6 text-neutral-900 lg:text-display3">
              APPS UNIQUELY ENABLED BY CRYPTO AND AI
            </h2>
            <Button
              intent="negative"
              size="medium"
              prefixIconName="Puzzle"
              className="mt-6 lg:mt-10"
              href={CHROME_EXTENSION_LINK}
              isExternal
              asLink
            >
              DOWNLOAD EXTENSION
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-[auto,_1fr] gap-6 lg:mt-0 lg:grid-cols-3">
            <Section title="GET STARTED" items={INTERNAL_LINKS} />
            <Section title="RESOURCES" items={EXTERNAL_RESOURCES} />
            <Section title="SOCIALS" items={SOCIALS} />
          </div>
        </div>
      </div>

      <Image
        src={idrissHalfTransparent}
        className="pointer-events-none -mx-2.5 my-2.5 max-w-[100vw] lg:absolute lg:inset-x-2.5 lg:bottom-0 lg:m-0 lg:max-w-[calc(100%_-20px)]"
        alt=""
      />

      <div className="border-t border-t-[#002D1E4D] px-safe">
        <div className="container justify-between gap-x-6 py-10 lg:mt-10 lg:flex xl:grid xl:grid-cols-2">
          <div>
            <Image
              className="mb-6 lg:mb-0"
              src="/idriss-dark-logo.svg"
              height={24}
              width={98}
              alt=""
            />
          </div>
          <div className="lg:flex lg:gap-x-8 xl:grid xl:grid-cols-3 xl:gap-x-0">
            <p className="mb-4 whitespace-nowrap text-body5 text-neutralGreen-700 opacity-60 lg:mb-0 lg:text-body4">
              Copyright © 2024 IDRISS. All rights reserved.
            </p>

            <div className="ml-auto flex items-center space-x-2 lg:col-span-2 lg:col-start-2">
              <Link
                size="medium"
                href={PRIVACY_POLICY_LINK}
                className="whitespace-nowrap"
                isExternal
              >
                Privacy policy
              </Link>
              <span className="text-neutralGreen-900/20">•</span>
              <Link
                size="medium"
                className="whitespace-nowrap"
                href={TERMS_OF_SERVICE_LINK}
                isExternal
              >
                Terms of service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
