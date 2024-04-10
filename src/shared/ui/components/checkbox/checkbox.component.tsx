import { CheckboxProperties } from './checkbox.types';

export const Checkbox = ({ value, onChange }: CheckboxProperties) => {
  return (
    <input
      checked={value}
      type="checkbox"
      onChange={(event) => {
        onChange(event.target.checked);
      }}
      className="size-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
    />
  );
};
