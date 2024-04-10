import { ReactNode } from 'react';

import { PolymorphicComponentPropertiesWithReference } from 'shared/ui/types';

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

export type PolimorphicInputBaseProperties<C extends React.ElementType> =
  PolymorphicComponentPropertiesWithReference<C, InputBaseProperties>;

export type InputBaseComponent = {
  Label: (properties: InputBaseLabelProperties) => JSX.Element;
} & (<C extends React.ElementType = 'label'>(
  properties: PolimorphicInputBaseProperties<C>,
) => React.ReactElement | null);
