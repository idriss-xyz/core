import { InputBaseProperties } from '../input-base';

export interface CurrencyInputProperties {
  inputBaseProps: Pick<
    InputBaseProperties,
    'label' | 'className' | 'errorMessage' | 'renderLabel'
  >;
  onChange: (value: number) => void;
  prefix?: string;
  value?: number;
  changeBy?: number;
  placeholder?: string;
  min?: number;
  disabled?: boolean;
  decimalScale?: number;
  iconButtonClassName?: string;
}
