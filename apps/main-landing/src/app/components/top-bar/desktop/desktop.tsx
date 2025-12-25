'use client';
import { useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { MAIN_LANDING_LINK } from '@idriss-xyz/constants';
import { Dialog } from '@idriss-xyz/ui/dialog';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { VisuallyHidden } from '@idriss-xyz/ui/visually-hidden';
import Link from 'next/link';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { classes } from '@idriss-xyz/ui/utils';
import { MobileNotSupported } from '@idriss-xyz/ui/mobile-not-supported';

import { EXTERNAL_LINK, INTERNAL_LINK } from '@/constants';
import { Socials as MobileSocials } from '@/components/top-bar/components/mobile/socials';
import { Socials as DesktopSocials } from '@/components/top-bar/components/desktop/socials';
import { useAuth } from '@/app/context/auth-context';
import { DonatePageAvatarMenu } from '@/app/[name]/donate-page-avatar-menu';
import { useStartEarningNavigation } from '@/app/utils/';

import { Menu } from './menu';
import { Socials } from './socials';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
  isSticky?: boolean;
  isLanding?: boolean;
  displayMobileCTA?: boolean;
  creatorDonationPage?: string;
};

export const Desktop = ({
  hideNavigation,
  displayCTA,
  isSticky,
  isLanding,
  displayMobileCTA,
  creatorDonationPage,
}: Properties) => {
  const handleStartEarningClick = useStartEarningNavigation();
  const { creator, donor } = useAuth();

  const [isMobileNotSupportedOpen, setIsMobileNotSupportedOpen] =
    useState(false);

  const handleMobileStartEarningClick = () => {
    setIsMobileNotSupportedOpen(true);
  };

  // Mobile menu component for landing pages
  const MobileMenu = () => {
    if (!isLanding) {
      return (
        <Dialog
          className="fixed inset-x-4 bottom-3 top-[76px] px-safe lg:hidden"
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
                                  Top streamers
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
                                  Top fans
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
                      <MobileSocials className="mt-auto" />
                    </NavigationMenu.List>
                  </NavigationMenu.Root>
                </div>
              </>
            );
          }}
        </Dialog>
      );
    }
    return null;
  };

  // Mobile landing content
  const MobileLandingContent = () => {
    if (isLanding) {
      return (
        <>
          <div className="flex flex-row flex-wrap items-center justify-end gap-x-1 xs:gap-2 sm:hidden">
            {displayMobileCTA && (
              <Button
                size="small"
                intent="primary"
                aria-label="Start earning"
                onClick={handleMobileStartEarningClick}
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
    return null;
  };

  return (
    <>
      {!hideNavigation && <Menu className="hidden lg:flex" />}

      {displayCTA ? (
        <div className="hidden items-center gap-x-9 sm:flex">
          <Socials />

          <Button
            size="medium"
            intent="primary"
            onClick={handleStartEarningClick}
            aria-label="Start earning"
            suffixIconName="IdrissArrowRight"
          >
            Start earning
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-x-2">
          <MobileMenu />
          {creator?.isDonor && (
            <Button
              asLink
              isExternal
              size="small"
              intent="secondary"
              href={
                creatorDonationPage
                  ? `${MAIN_LANDING_LINK}/invite/${creatorDonationPage}`
                  : MAIN_LANDING_LINK
              }
              className="uppercase md:px-5 md:py-3.5"
            >
              Create your page
            </Button>
          )}
          {donor ? (
            <DonatePageAvatarMenu />
          ) : (
            <Socials className="hidden sm:flex" />
          )}
        </div>
      )}

      <MobileLandingContent />
    </>
  );
};
