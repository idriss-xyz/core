import { ForwardedRef, forwardRef, HTMLProps, useState } from 'react';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

import { alert, AlertVariants, icon, iconClass } from './variants';

type Properties = {
  heading: string;
  description: string;
  onClose?: () => void;
} & AlertVariants &
  HTMLProps<HTMLSpanElement>;

export const Alert = forwardRef(
  (
    {
      children,
      type,
      className,
      heading,
      description,
      onClose,
      ...properties
    }: Properties,
    reference: ForwardedRef<HTMLSpanElement>,
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    const variantClassName = classes(alert({ type }), className);
    const iconName = icon[type];
    const iconClassName = iconClass({ type });

    const Component = 'span';

    const handleClose = () => {
      setIsVisible(false);
      if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
      <Component {...properties} ref={reference} className={variantClassName}>
        <span className={iconClassName}>
          <Icon name={iconName} size={20} />
        </span>

        <div className="grid grid-cols-[1fr,32px] items-start">
          <div className="flex flex-col items-start gap-y-1">
            <p className="text-label3 text-neutral-900">{heading}</p>
            <p className="text-body4 text-neutral-600">{description}</p>
          </div>

          <IconButton
            size="small"
            iconName="X"
            intent="tertiary"
            onClick={handleClose}
            className="-right-2 -top-2 text-neutral-500"
          />
        </div>
        {children}
      </Component>
    );
  },
);

Alert.displayName = 'Alert';
