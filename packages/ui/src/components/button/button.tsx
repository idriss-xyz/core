import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react';

import { classes } from '../../utils';
import { Icon, IconName } from '../icon';
import { ExternalLink } from '../external-link';

import { button, ButtonVariants } from './variants';
import { Glow } from './glow';
import { BUTTON_SIZE_TO_ICON_SIZE } from './constants';

type ButtonOrAnchorProperties =
  | (ButtonHTMLAttributes<HTMLButtonElement> & { asLink?: false })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
      asLink: true;
      isExternal?: boolean;
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

    if (properties.asLink) {
      const Component = properties.isExternal ? ExternalLink : 'a';
      const { isExternal, asLink, ...htmlValidProperties } = properties;

      return (
        <Component
          {...(htmlValidProperties as AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={reference as ForwardedRef<HTMLAnchorElement>}
          className={variantClassName}
        >
          {content}
        </Component>
      );
    }

    const { asLink, ...htmlValidProperties } = properties;

    return (
      <button
        {...(htmlValidProperties as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={reference as ForwardedRef<HTMLButtonElement>}
        className={variantClassName}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
