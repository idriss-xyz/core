import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { MoreHorizontal } from 'lucide-react';

import { classes } from '../../utils';
import { Icon } from '../icon';

function Breadcrumb({ ...properties }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...properties} />;
}

function BreadcrumbList({
  className,
  ...properties
}: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={classes(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
        className,
      )}
      {...properties}
    />
  );
}

function BreadcrumbItem({
  className,
  ...properties
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={classes('inline-flex items-center gap-1.5', className)}
      {...properties}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...properties
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={classes('hover:text-foreground transition-colors', className)}
      {...properties}
    />
  );
}

function BreadcrumbPage({
  className,
  ...properties
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={classes('text-foreground font-normal', className)}
      {...properties}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...properties
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={classes('[&>svg]:size-3.5', className)}
      {...properties}
    >
      {children ?? <Icon name="IdrissArrowRight" size={16} />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...properties
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={classes('flex size-9 items-center justify-center', className)}
      {...properties}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
