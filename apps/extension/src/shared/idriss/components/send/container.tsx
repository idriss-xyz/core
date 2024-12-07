import { ReactNode, memo, useCallback, useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { Modal } from '@idriss-xyz/ui/modal';

import { PortalWithTailwind } from 'shared/ui';

import { WIDGET_WIDTH } from '../../constants';

interface RenderChildrenProperties {
  close: () => void;
}

interface Properties {
  node: HTMLElement;
  recipientName: string;
  onOpen?: () => void;
  onClose?: () => void;
  children: (v: RenderChildrenProperties) => ReactNode;
  iconSize: number;
  iconSrc: string;
  closeOnClickAway: boolean;
  header?: ReactNode;
}

export const Container = memo(
  ({
    node,
    iconSize,
    iconSrc,
    children,
    onClose,
    onOpen,
    header,
    closeOnClickAway,
  }: Properties) => {
    const [closeOnHoverAway, setCloseOnHoverAway] = useState(true);
    const [isOpened, setIsOpened] = useState(false);

    const [portal, setPortal] = useState<HTMLDivElement>();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width < 500;
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const widgetEndsAtX = position.x + WIDGET_WIDTH;
    const spaceLeft = windowSize.width - widgetEndsAtX;
    const left = isMobile || spaceLeft < 0 ? undefined : position.x;
    const right = isMobile || spaceLeft < 0 ? 0 : undefined;

    const updatePosition = useCallback(() => {
      if (!portal) {
        return;
      }
      const elementRect = portal.getBoundingClientRect();
      setPosition({
        x: elementRect.right,
        y: elementRect.top + window.scrollY,
      });
    }, [portal]);

    const open = useCallback(() => {
      updatePosition();
      setIsOpened(true);
      onOpen?.();
    }, [onOpen, updatePosition]);

    useEffect(() => {
      const container = document.createElement('div');
      node.append(container);
      const shadowRoot = container.attachShadow({ mode: 'open' });
      const newPortal = document.createElement('div');
      shadowRoot.append(newPortal);
      setPortal(newPortal);

      return () => {
        newPortal?.remove();
        container?.remove();
        setPortal(undefined);
      };
    }, [node]);

    const close = useCallback(() => {
      setIsOpened(false);
      onClose?.();
    }, [onClose]);

    const disableCloseOnHoverAway = useCallback(() => {
      setCloseOnHoverAway(false);
    }, []);

    if (!portal) {
      return null;
    }

    return (
      <>
        {isOpened && (
          <div onClick={disableCloseOnHoverAway}>
            <Modal
              header={header}
              headerContainerClassName="pl-6 pt-5.5 pb-2.5"
              isOpened={isOpened}
              closeOnHoverAway={closeOnHoverAway}
              closeOnClickAway={closeOnClickAway}
              onClose={close}
              backdropClassName="bg-transparent"
              onClickInside={disableCloseOnHoverAway}
              left={left}
              top={position.y + iconSize}
              right={right}
              width={WIDGET_WIDTH}
              withoutPortal
            >
              <div>{children({ close })}</div>
            </Modal>
          </div>
        )}
        <PortalWithTailwind container={portal}>
          <img
            src={iconSrc}
            width={iconSize}
            height={iconSize}
            className="relative z-1 ml-0.5 cursor-pointer"
            onMouseOver={open}
          />
        </PortalWithTailwind>
      </>
    );
  },
);

Container.displayName = 'SendContainer';
