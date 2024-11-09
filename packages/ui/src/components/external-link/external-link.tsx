import { AnchorHTMLAttributes, ForwardedRef, forwardRef } from 'react';

type Properties = AnchorHTMLAttributes<HTMLAnchorElement>;

export const ExternalLink = forwardRef(
  (
    { children, ...properties }: Properties,
    reference: ForwardedRef<HTMLAnchorElement>,
  ) => {
    return (
      <a
        ref={reference}
        target="_blank"
        rel="noreferrer noopener"
        {...properties}
      >
        {children}
      </a>
    );
  },
);

ExternalLink.displayName = 'ExternalLink';
