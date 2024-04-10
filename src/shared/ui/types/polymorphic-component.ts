import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';

interface AsProperty<C extends ElementType> {
  as?: C;
}

type PropertiesToOmit<C extends ElementType, P> = keyof (AsProperty<C> & P);

type PolymorphicReference<C extends ElementType> =
  ComponentPropsWithRef<C>['ref'];

type PolymorphicComponentProperty<
  C extends ElementType,
  Properties = object,
> = PropsWithChildren<Properties & AsProperty<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropertiesToOmit<C, Properties>>;

export type PolymorphicComponentPropertiesWithReference<
  C extends React.ElementType,
  Properties = object,
> = PolymorphicComponentProperty<C, Properties> & {
  ref?: PolymorphicReference<C>;
};
