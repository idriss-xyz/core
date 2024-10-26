'use client';
import { Button, Dialog, IconButton, VisuallyHidden } from '@idriss-xyz/ui';
import { MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

import { APPS_SECTION_NAVIGATION_ITEMS } from '../constants';

import { Section } from './section';
import { Socials } from './socials';

export const MobileNavigation = () => {
  return (
    <nav className="container flex items-center justify-between px-4 py-1">
      <Image
        src="/logo-idriss-dark.png"
        height={24}
        width={98}
        alt=""
        priority
      />
      <Dialog
        className="fixed inset-x-4 bottom-3 top-[76px] flex flex-col rounded-[36px] border border-mint-400 px-4 py-6 text-neutralGreen-900 backdrop-blur-[90px]" // top-[76px] is 64px height of navbar + 12px spacing, ideally it should be ref attached to nav to read component height in case it changes in future
        trigger={({ isOpened }) => {
          const iconSize = 20;
          const icon = isOpened ? (
            <XIcon size={iconSize} />
          ) : (
            <MenuIcon size={iconSize} />
          );

          return <IconButton icon={icon} intent="tertiary" size="large" />;
        }}
      >
        {({ close }) => {
          return (
            <>
              <VisuallyHidden>
                <Dialog.Title>Website navigation</Dialog.Title>
              </VisuallyHidden>
              <div className="space-y-6">
                <Section
                  items={APPS_SECTION_NAVIGATION_ITEMS}
                  title={
                    // TODO: we need to create isomorphic button component so it will be as="a" href="/#..."
                    <Button intent="tertiary" size="large" onClick={close}>
                      APPS
                    </Button>
                  }
                  onItemClick={close}
                />
                <Section
                  title={
                    // TODO: we need to create isomorphic button component so it will be as="a" href="/#..."
                    <Button intent="tertiary" size="large" onClick={close}>
                      TOKEN
                    </Button>
                  }
                />
                <Section
                  title={
                    // TODO: we need to create isomorphic button component so it will be as="a" href="/#..."
                    <Button intent="tertiary" size="large" onClick={close}>
                      DOCS
                    </Button>
                  }
                />
              </div>
              <Socials className="mt-auto" />
            </>
          );
        }}
      </Dialog>
    </nav>
  );
};
