import {
  ForwardedRef,
  forwardRef,
  HTMLProps,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { classes } from '../../utils';
import { Icon, IconName } from '../icon';
import { IconButton } from '../icon-button';

import { toast, ToastVariants, icon, iconClass } from './variants';

type Properties = {
  heading: string;
  description?: string;
  autoClose?: boolean;
  closable?: boolean;
  show?: boolean;
  iconName?: IconName;
  setShow?: (show: boolean) => void;
  onClose?: () => void;
  actionButtons?: (close: () => void) => ReactNode;
} & ToastVariants &
  HTMLProps<HTMLSpanElement>;

// Meant to be used within Toast context as in creators app
export const Toast = forwardRef(
  (
    {
      type,
      className,
      heading,
      description,
      autoClose,
      closable,
      iconName,
      onClose,
      actionButtons,
      ...properties
    }: Properties,
    reference: ForwardedRef<HTMLSpanElement>,
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    const variantClassName = classes(toast({ type }), className);
    const iconClassName = iconClass({ type });

    const Component = 'span';

    const handleClose = useCallback(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, [onClose]);

    useEffect(() => {
      if (autoClose && isVisible) {
        const timeout = setTimeout(() => {
          handleClose();
        }, 3000);
        return () => {
          return clearTimeout(timeout);
        };
      }
      return () => {};
    }, [isVisible, autoClose, onClose, handleClose]);

    if (!isVisible) return null;

    return (
      <Component {...properties} ref={reference} className={variantClassName}>
        <span className={iconClassName}>
          <Icon name={iconName ?? icon[type]} size={20} />
        </span>

        <div
          className={`grid ${autoClose || !closable ? 'grid-cols-[1fr]' : 'grid-cols-[1fr,32px]'}`}
        >
          <div className="flex flex-col gap-y-1">
            <p className="flex h-full items-center text-label3 text-neutral-900">
              {heading}
            </p>
            {description && (
              <p className="text-body5 text-neutral-600">{description}</p>
            )}

            {actionButtons && (
              <div className="mt-2 flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
                {actionButtons(handleClose)}
              </div>
            )}
          </div>
          {!autoClose && closable && (
            <IconButton
              size="small"
              iconName="X"
              intent="tertiary"
              onClick={handleClose}
              className="-right-2 -top-2 text-neutral-500"
            />
          )}
        </div>
      </Component>
    );
  },
);

Toast.displayName = 'Toast';
