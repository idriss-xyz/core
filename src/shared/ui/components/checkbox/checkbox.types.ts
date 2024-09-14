export type CheckboxProperties = {
  label?: string;
  disabled?: boolean;
  className?: string;
  disabledTooltipText?: string;
  additionalClassNameWhenChecked?: string;
  onChange: (value: boolean) => void;
} & (
  | {
      value: boolean;
      type?: 'binary';
    }
  | {
      type: 'extended';
      value?: ExtendedCheckboxOption;
    }
);

export type ExtendedCheckboxOption = 'checked' | 'intermediate' | 'unchecked';
