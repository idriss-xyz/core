import { ReactNode } from 'react';

import { PolymorphicComponentProperties } from 'shared/ui/types';

export interface InputBaseLabelProperties {
  className?: string;
  label: string;
}

export interface InputBaseProperties {
  children: ReactNode;
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
  renderLabel?: () => ReactNode;
}

export type PolymorphicInputBaseProperties<C extends React.ElementType> =
  PolymorphicComponentProperties<C, InputBaseProperties>;

export type InputBaseComponent = {
  Label: (properties: InputBaseLabelProperties) => JSX.Element;
} & (<C extends React.ElementType = 'label'>(
  properties: PolymorphicInputBaseProperties<C>,
) => React.ReactElement | null);
