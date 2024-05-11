import { memo, useCallback, useEffect, useState } from 'react';

import { Closable } from 'shared/ui/components';

import { Application } from '../types';
import { GITCOIN_ICON } from '../constants';
import { DonationForm } from '../components';

interface Properties {
  application: Application;
  node: Element;
  username: string;
  iconSize: number;
}

export const DonationWidget = memo(
  ({ application, node, username, iconSize }: Properties) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [closeOnClickAway, setCloseOnClickAway] = useState(true);

    useEffect(() => {
      const element = document.createElement('img');
      element.style.height = `${iconSize}px`;
      element.style.width = `${iconSize}px`;
      element.style.cursor = 'pointer';
      element.src = GITCOIN_ICON;
      const elementToInject = node.querySelector('span');
      if (!elementToInject) {
        return;
      }

      elementToInject.style.setProperty('display', 'inline-flex', 'important');
      elementToInject.style.setProperty('align-items', 'center', 'important');
      elementToInject.style.setProperty('gap', '4px', 'important');
      elementToInject?.append(element);
      const updatePosition = () => {
        const elementRect = element.getBoundingClientRect();
        setPosition({
          x: elementRect.right,
          y: elementRect.top + window.scrollY,
        });
      };

      const onClick = (event: MouseEvent) => {
        event.preventDefault();
        setIsVisible(true);
        updatePosition();
      };

      element.addEventListener('click', onClick);
      window.addEventListener('resize', updatePosition);

      return () => {
        element.removeEventListener('click', onClick);
        window.removeEventListener('resize', updatePosition);
        element.remove();
      };
    }, [iconSize, node]);

    const close = useCallback(() => {
      setIsVisible(false);
    }, []);

    if (!isVisible) {
      return null;
    }

    return (
      <Closable
        left={position.x}
        top={position.y + iconSize}
        onClose={close}
        className="absolute w-64 rounded-md bg-white text-gray-900 shadow-2xl"
        closeButtonClassName="hover:enabled:bg-black/20 active:enabled:bg-black/40"
        closeButtonIconClassName="text-[#000]"
        closeOnClickAway={closeOnClickAway}
      >
        <DonationForm
          onClose={close}
          application={application}
          className="mt-4"
          username={username}
          onStartDonating={() => {
            setCloseOnClickAway(false);
          }}
        />
      </Closable>
    );
  },
);

DonationWidget.displayName = 'DonationWidget';
