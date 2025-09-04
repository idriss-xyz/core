'use client';
import { useState } from 'react';
import { Dialog } from '@idriss-xyz/ui/dialog';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { VisuallyHidden } from '@idriss-xyz/ui/visually-hidden';
import { Button } from '@idriss-xyz/ui/button';
import Link from 'next/link';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { classes } from '@idriss-xyz/ui/utils';
import { MobileNotSupported } from '@idriss-xyz/ui/mobile-not-supported';

import { EXTERNAL_LINK, INTERNAL_LINK } from '@/constants';
import { Socials } from '@/components/top-bar/components/mobile/socials';
import { Socials as DesktopSocials } from '@/components/top-bar/components/desktop/socials';

type Properties = {
  isSticky?: boolean;
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Mobile = ({
  isSticky,
  isLanding,
  displayCTA,
  hideNavigation,
}: Properties) => {
  const [isMobileNotSupportedOpen, setIsMobileNotSupportedOpen] =
    useState(false);

  const handleStartEarningClick = () => {
    setIsMobileNotSupportedOpen(true);
  };

  if (isLanding) {
    return (
      <>
        <div className="flex flex-row flex-wrap items-center justify-end gap-x-1 xs:gap-2 sm:hidden">
          {displayCTA && (
            <Button
              size="small"
              intent="primary"
              aria-label="Start earning"
              onClick={handleStartEarningClick}
              suffixIconName="IdrissArrowRight"
            >
              Start earning
            </Button>
          )}

          <DesktopSocials
            enlargeIcon={!isSticky}
            className={classes(isSticky && 'space-x-1 xs:space-x-2')}
            iconClassName={classes(isSticky && 'px-1 xs:px-2')}
          />
        </div>
        {isMobileNotSupportedOpen && (
          <MobileNotSupported
            className="bg-[#E7F5E6]/[0.6] backdrop-blur-sm"
            onClose={() => {
              return setIsMobileNotSupportedOpen(false);
            }}
          >
            <p className="text-balance text-center text-heading5 text-neutralGreen-700">
              This experience is designed for desktop.
            </p>
            <p className="text-balance text-center text-heading5 text-neutralGreen-700">
              Please use a PC or a laptop.
            </p>
          </MobileNotSupported>
        )}
      </>
    );
  }

  return (
    <Dialog
      className="fixed inset-x-4 bottom-3 top-[76px] px-safe" // top-[76px] is 64px height of navbar + 12px spacing, ideally it should be ref attached to nav to read component height in case it changes in future
      trigger={({ isOpened }) => {
        return (
          <IconButton
            className="lg:hidden"
            aria-label={
              isOpened ? 'Hide navigation menu' : 'Open navigation menu'
            }
            iconName={isOpened ? 'X' : 'Menu'}
            intent="tertiary"
            size="large"
          />
        );
      }}
    >
      {() => {
        return (
          <>
            <VisuallyHidden>
              <Dialog.Title>Website navigation</Dialog.Title>
            </VisuallyHidden>

            <div className="flex size-full flex-col overflow-auto rounded-[36px] border border-[#5FEB3C] bg-white/50 px-4 py-6 text-neutralGreen-900 backdrop-blur-[45px]">
              <NavigationMenu.Root className="grid h-full">
                <NavigationMenu.List className="flex h-full flex-col justify-between">
                  {hideNavigation ? (
                    <span />
                  ) : (
                    <div className="space-y-6">
                      <NavigationMenu.Link asChild>
                        <span>
                          <Link
                            passHref
                            legacyBehavior
                            href={EXTERNAL_LINK.TOP_CREATORS}
                          >
                            <Button
                              intent="tertiary"
                              size="large"
                              asLink
                              className="uppercase"
                            >
                              Top creators
                            </Button>
                          </Link>
                        </span>
                      </NavigationMenu.Link>

                      <NavigationMenu.Link asChild>
                        <span>
                          <Link
                            passHref
                            legacyBehavior
                            href={EXTERNAL_LINK.TOP_DONORS}
                          >
                            <Button
                              intent="tertiary"
                              size="large"
                              asLink
                              className="uppercase"
                            >
                              Top donors
                            </Button>
                          </Link>
                        </span>
                      </NavigationMenu.Link>

                      <NavigationMenu.Link asChild>
                        <span>
                          <Link
                            passHref
                            legacyBehavior
                            href={INTERNAL_LINK.TOKEN}
                          >
                            <Button
                              intent="tertiary"
                              size="large"
                              asLink
                              className="uppercase"
                            >
                              Token
                            </Button>
                          </Link>
                        </span>
                      </NavigationMenu.Link>
                    </div>
                  )}

                  <Socials className="mt-auto" />
                </NavigationMenu.List>
              </NavigationMenu.Root>
            </div>
          </>
        );
      }}
    </Dialog>
  );
};
