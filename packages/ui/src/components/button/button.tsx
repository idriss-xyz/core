import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react';

import { classes } from '../../utils';
import { Icon, IconName } from '../icon';
import { ExternalLink } from '../external-link';
import { Spinner } from '../spinner';

import { button, ButtonVariants } from './variants';
import { Glow } from './glow';
import { BUTTON_SIZE_TO_ICON_SIZE } from './constants';

type ButtonOrAnchorProperties =
  | (ButtonHTMLAttributes<HTMLButtonElement> & {
      asLink?: false;
      loading?: boolean;
    })
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
    const isLoading = (!properties.asLink && properties.loading) ?? false;
    const variantClassName = classes(
      button({
        intent,
        size,
        className,
        isLoading: isLoading,
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
            className={classes('mr-2', isLoading && 'opacity-0')}
          />
        )}
        <span className={classes(isLoading && 'opacity-0')}>{children}</span>
        {suffixIconName && (
          <Icon
            name={suffixIconName}
            size={BUTTON_SIZE_TO_ICON_SIZE[size]}
            className={classes('ml-2', isLoading && 'opacity-0')}
          />
        )}
        <Glow intent={intent} size={size} loading={isLoading} />
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

    const {
      asLink,
      disabled: disabledFromProperties,
      loading,
      ...htmlValidProperties
    } = properties;

    const disabled = Boolean(loading) || Boolean(disabledFromProperties);

    const contentWithSpinner = (
      <>
        {content}
        <Spinner
          className={classes(
            'absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2',
            size === 'large' && 'size-[34px]',
          )}
        />
      </>
    );

    return (
      <button
        {...(htmlValidProperties as ButtonHTMLAttributes<HTMLButtonElement>)}
        type={htmlValidProperties.type ?? 'button'}
        ref={reference as ForwardedRef<HTMLButtonElement>}
        className={variantClassName}
        disabled={disabled}
      >
        {loading ? contentWithSpinner : content}
      </button>
    );
  },
);

Button.displayName = 'Button';
