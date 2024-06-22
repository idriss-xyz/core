import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useUpdateEffect, useWindowSize } from 'react-use';

import { Closable } from 'shared/ui';

interface RenderChildrenProperties {
  close: () => void;
}

interface Properties {
  node: HTMLElement;
  recipientName: string;
  onClose?: () => void;
  children: (v: RenderChildrenProperties) => ReactNode;
  iconSize: number;
  iconSrc: string;
  widgetDataAttribute: string;
  closeOnClickAway: boolean;
}

export const Container = memo(
  ({
    node,
    iconSize,
    iconSrc,
    children,
    onClose,
    widgetDataAttribute,
    closeOnClickAway,
  }: Properties) => {
    const [closeOnHoverAway, setCloseOnHoverAway] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const windowSize = useWindowSize();

    const isMobile = windowSize.width < 500;

    const injectedWidgetReference = useRef<HTMLImageElement | null>(null);
    const location = useLocation();
    useUpdateEffect(() => {
      return () => {
        injectedWidgetReference.current?.remove();
      };
    }, [location.pathname]);

    useEffect(() => {
      injectedWidgetReference.current = document.createElement('img');
      injectedWidgetReference.current.setAttribute(
        `data-${widgetDataAttribute}`,
        'true',
      );
      injectedWidgetReference.current.style.height = `${iconSize}px`;
      injectedWidgetReference.current.style.width = `${iconSize}px`;
      injectedWidgetReference.current.style.cursor = 'pointer';
      injectedWidgetReference.current.style.marginLeft = '2px';
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
    }, [iconSize, iconSrc, node, widgetDataAttribute]);

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
        <Closable
          left={!isMobile ? position.x : undefined}
          right={isMobile ? 0 : undefined}
          top={position.y + iconSize}
          className="absolute w-64 rounded-md bg-white text-gray-900 shadow-2xl"
          closeButtonClassName="hover:enabled:bg-black/20 active:enabled:bg-black/40"
          closeButtonIconClassName="text-[#000]"
          onClickInside={disableCloseOnHoverAway}
          onClose={close}
          closeOnHoverAway={closeOnHoverAway}
          closeOnClickAway={closeOnClickAway}
        >
          {children({ close })}
        </Closable>
        <img
          className="absolute"
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
