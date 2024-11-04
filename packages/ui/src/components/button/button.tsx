import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react';

import { classes } from '../../utils';
import { Icon, IconName } from '../icon';

import { button, ButtonVariants } from './variants';
import { Glow } from './glow';
import { BUTTON_SIZE_TO_ICON_SIZE } from './constants';

type ButtonOrAnchorProperties =
  | (ButtonHTMLAttributes<HTMLButtonElement> & { asLink?: false })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
      asLink: true;
      href?: string;
      target?: string;
      rel?: string;
    });

type Properties = ButtonOrAnchorProperties &
  ButtonVariants & {
    prefixIconName?: IconName;
    suffixIconName?: IconName;
  };

export const Button = forwardRef(
  (
    {
      children,
      className,
      intent,
      size,
      prefixIconName,
      suffixIconName,
      asLink = false,
      ...properties
    }: Properties,
    reference,
  ) => {
    const variantClassName = classes(
      button({
        intent,
        size,
        className,
        withPrefixIcon: Boolean(prefixIconName),
        withSuffixIcon: Boolean(suffixIconName),
      }),
    );

    const content = (
      <>
        {prefixIconName && (
          <Icon
            name={prefixIconName}
            size={BUTTON_SIZE_TO_ICON_SIZE[size]}
            className="mr-2"
          />
        )}
        <span>{children}</span>
        {suffixIconName && (
          <Icon
            name={suffixIconName}
            size={BUTTON_SIZE_TO_ICON_SIZE[size]}
            className="ml-2"
          />
        )}
        <Glow intent={intent} size={size} />
      </>
    );

    if (asLink) {
      return (
        <a
          {...(properties as AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={reference as ForwardedRef<HTMLAnchorElement>}
          className={variantClassName}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...(properties as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={reference as ForwardedRef<HTMLButtonElement>}
        className={variantClassName}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
