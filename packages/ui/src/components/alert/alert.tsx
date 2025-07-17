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
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

import { alert, AlertVariants, icon, iconClass } from './variants';

type Properties = {
  heading: string;
  description: string;
  autoClose?: boolean;
  show?: boolean;
  setShow?: (show: boolean) => void;
  onClose?: () => void;
  actionButtons?: (close: () => void) => ReactNode;
} & AlertVariants &
  HTMLProps<HTMLSpanElement>;

export const Alert = forwardRef(
  (
    {
      type,
      className,
      heading,
      description,
      autoClose,
      onClose,
      actionButtons,
      ...properties
    }: Properties,
    reference: ForwardedRef<HTMLSpanElement>,
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    const variantClassName = classes(alert({ type }), className);
    const iconName = icon[type];
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
          <Icon name={iconName} size={20} />
        </span>

        <div className="grid grid-cols-[1fr,32px] items-start">
          <div className="flex flex-col items-start gap-y-1">
            <p className="text-label3 text-neutral-900">{heading}</p>
            <p className="text-body5 text-neutral-600">{description}</p>

            {actionButtons && (
              <div className="mt-2 flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
                {actionButtons(handleClose)}
              </div>
            )}
          </div>

          <IconButton
            size="small"
            iconName="X"
            intent="tertiary"
            onClick={handleClose}
            className="-right-2 -top-2 text-neutral-500"
          />
        </div>
      </Component>
    );
  },
);

Alert.displayName = 'Alert';
