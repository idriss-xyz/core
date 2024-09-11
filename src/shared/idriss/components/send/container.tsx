import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useUpdateEffect, useWindowSize } from 'react-use';

import { useExtensionSettings } from 'shared/extension';
import { Closable } from 'shared/ui';

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
}

export const Container = memo(
  ({
    node,
    iconSize,
    iconSrc,
    children,
    onClose,
    onOpen,
    closeOnClickAway,
  }: Properties) => {
    const [closeOnHoverAway, setCloseOnHoverAway] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const windowSize = useWindowSize();
    const isMobile = windowSize.width < 500;
    const widgetEndsAtX = position.x + WIDGET_WIDTH;
    const spaceLeft = windowSize.width - widgetEndsAtX;
    const left = isMobile || spaceLeft < 0 ? undefined : position.x;
    const right = isMobile || spaceLeft < 0 ? 0 : undefined;

    const injectedWidgetReference = useRef<HTMLImageElement | null>(null);
    const location = useLocation();
    const { extensionSettings } = useExtensionSettings();
    useEffect(() => {
      if (!extensionSettings['entire-extension-enabled']) {
        for (const element of document.querySelectorAll(
          '[data-idriss-widget="true"]',
        ))
          element.remove();
      }
    }, [extensionSettings]);

    useUpdateEffect(() => {
      return () => {
        injectedWidgetReference.current?.remove();
      };
    }, [location.pathname]);

    useEffect(() => {
      injectedWidgetReference.current = document.createElement('img');
      injectedWidgetReference.current.setAttribute(
        `data-idriss-widget`,
        'true',
      );
      injectedWidgetReference.current.style.height = `${iconSize}px`;
      injectedWidgetReference.current.style.width = `${iconSize}px`;
      injectedWidgetReference.current.style.cursor = 'pointer';
      injectedWidgetReference.current.style.marginLeft = '2px';
      injectedWidgetReference.current.style.zIndex = '20';
      injectedWidgetReference.current.src = iconSrc;

      node.style.setProperty('display', 'inline-flex', 'important');
      node?.append(injectedWidgetReference.current);

      const updatePosition = () => {
        if (!injectedWidgetReference.current) {
          return;
        }
        const elementRect =
          injectedWidgetReference.current.getBoundingClientRect();
        setPosition({
          x: elementRect.right,
          y: elementRect.top + window.scrollY,
        });
      };

      const openWidget = (event: Event) => {
        event.preventDefault();
        setIsVisible(true);
        updatePosition();
        onOpen?.();
      };

      injectedWidgetReference.current?.addEventListener(
        'mouseover',
        openWidget,
      );
      window.addEventListener('resize', updatePosition);

      return () => {
        injectedWidgetReference.current?.removeEventListener(
          'mouseover',
          openWidget,
        );
        window.removeEventListener('resize', updatePosition);
        injectedWidgetReference.current?.remove();
      };
    }, [iconSize, iconSrc, node, onOpen]);

    const close = useCallback(() => {
      setIsVisible(false);
      onClose?.();
    }, [onClose]);

    const disableCloseOnHoverAway = useCallback(() => {
      setCloseOnHoverAway(false);
    }, []);

    if (!isVisible) {
      return null;
    }

    return (
      <>
        <div
          className="absolute z-20"
          style={{
            left,
            right,
            top: position.y + iconSize,
            width: WIDGET_WIDTH,
          }}
        >
          <Closable
            className="w-full rounded-md bg-white text-gray-900 shadow-2xl"
            closeButtonClassName="hover:enabled:bg-black/20 active:enabled:bg-black/40"
            closeButtonIconClassName="text-[#000]"
            onClickInside={disableCloseOnHoverAway}
            onClose={close}
            closeOnHoverAway={closeOnHoverAway}
            closeOnClickAway={closeOnClickAway}
          >
            {children({ close })}
          </Closable>
        </div>
        <img
          className="absolute z-20"
          style={{
            left: position.x - iconSize,
            top: position.y,
            width: iconSize,
            height: iconSize,
          }}
          src={iconSrc}
        />
      </>
    );
  },
);

Container.displayName = 'SendContainer';
