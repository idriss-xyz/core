'use client';
import { Dialog } from '@idriss-xyz/ui/dialog';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { VisuallyHidden } from '@idriss-xyz/ui/visually-hidden';
import { Button } from '@idriss-xyz/ui/button';
import Link from 'next/link';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { CREATORS_FORM_LINK } from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';

import { EXTERNAL_LINK, INTERNAL_LINK } from '@/constants';
import { Socials } from '@/components/top-bar/components/mobile/socials';
import { Socials as DesktopSocials } from '@/components/top-bar/components/desktop/socials';

type Properties = {
  isSticky?: boolean;
  isLanding?: boolean;
  hideNavigation?: boolean;
};

export const Mobile = ({ hideNavigation, isLanding, isSticky }: Properties) => {
  if (isLanding) {
    return (
      <div className="flex flex-row flex-wrap items-center justify-end gap-2 md:hidden">
        {isSticky && (

        <Button
          asLink
          size="small"
          intent="primary"
          href={CREATORS_FORM_LINK}
          aria-label="Start earning"
          suffixIconName="IdrissArrowRight"
        >
          START EARNING
        </Button>
        )}

        <DesktopSocials
          enlargeIcon={!isSticky}
          iconClassName={classes(isSticky && 'px-2')}
        />
      </div>
    );
  }

  return (
    <Dialog
      className="fixed inset-x-4 bottom-3 top-[76px] px-safe" // top-[76px] is 64px height of navbar + 12px spacing, ideally it should be ref attached to nav to read component height in case it changes in future
      trigger={({ isOpened }) => {
        return (
          <IconButton
            className="md:hidden"
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
                            <Button intent="tertiary" size="large" asLink>
                              TOP CREATORS
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
                            <Button intent="tertiary" size="large" asLink>
                              TOP DONORS
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
                            <Button intent="tertiary" size="large" asLink>
                              TOKEN
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
