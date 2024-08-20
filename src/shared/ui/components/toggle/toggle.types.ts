export interface ToggleProperties {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
