'use client';
import { Dialog } from '@idriss-xyz/ui/dialog';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { VisuallyHidden } from '@idriss-xyz/ui/visually-hidden';
import { Button } from '@idriss-xyz/ui/button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { DOCUMENTATION_LINK_DAO } from '@idriss-xyz/constants';

import { EXTERNAL_LINK, INTERNAL_LINK } from '@/constants';

import { Socials } from './socials';

export const Mobile = () => {
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
      {({ close }) => {
        return (
          <>
            <VisuallyHidden>
              <Dialog.Title>Website navigation</Dialog.Title>
            </VisuallyHidden>

            <div className="flex size-full flex-col overflow-auto rounded-[36px] border border-[#5FEB3C] bg-white/50 px-4 py-6 text-neutralGreen-900 backdrop-blur-[45px]">
              <NavigationMenu.Root className="flex h-full">
                <NavigationMenu.List className="flex h-full flex-col justify-between">
                  <div className="space-y-6">
                    <NavigationMenu.Item>
                      <NavigationMenu.Link asChild>
                        <span>
                          <Button
                            intent="tertiary"
                            size="large"
                            onClick={close}
                            href={INTERNAL_LINK.CREATORS}
                            asLink
                          >
                            APP
                          </Button>
                        </span>
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Link asChild>
                      <span>
                        <Button
                          intent="tertiary"
                          size="large"
                          onClick={close}
                          href={INTERNAL_LINK.TOKEN}
                          asLink
                        >
                          TOKEN
                        </Button>
                      </span>
                    </NavigationMenu.Link>

                    <NavigationMenu.Link asChild>
                      <span>
                        <Button
                          intent="tertiary"
                          size="large"
                          onClick={close}
                          href={EXTERNAL_LINK.VAULT}
                          isExternal
                          asLink
                        >
                          VAULT
                        </Button>
                      </span>
                    </NavigationMenu.Link>

                    <NavigationMenu.Link asChild>
                      <span>
                        <Button
                          intent="tertiary"
                          size="large"
                          onClick={close}
                          href={DOCUMENTATION_LINK_DAO}
                          isExternal
                          asLink
                        >
                          DOCS
                        </Button>
                      </span>
                    </NavigationMenu.Link>
                  </div>

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
