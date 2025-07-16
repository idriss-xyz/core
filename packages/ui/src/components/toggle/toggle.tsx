import { Switch } from '../switch';

export interface ToggleProperties {
  value: boolean;
  label?: string;
  sublabel?: string;
  onChange: (value: boolean) => void;
}

export function Toggle({ value, label, sublabel, onChange }: ToggleProperties) {
  return (
    <div className="flex items-start gap-2">
      <Switch value={value} onChange={onChange} />
      <div className="flex flex-col gap-0">
        {label && <span className="text-body4">{label}</span>}
        {sublabel && (
          <span className="text-body5 text-neutral-600">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
