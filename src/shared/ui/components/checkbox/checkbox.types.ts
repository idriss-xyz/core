export interface CheckboxProperties {
  label?: string;
  disabled?: boolean;
  className?: string;
  disabledTooltipText?: string;
  additionalClassNameWhenChecked?: string;
  onChange: (value: boolean) => void;
  checked: boolean | null;
}
