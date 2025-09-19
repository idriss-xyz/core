import { useState } from 'react';

type NumericButtonGroupProperties = {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export const NumericButtonGroup = ({
  min = 0,
  max = Infinity,
  defaultValue = 0,
  onChange,
}: NumericButtonGroupProperties) => {
  const [value, setValue] = useState(defaultValue);

  const handleDecrement = () => {
    setValue((previous) => {
      const newValue = Math.max(previous - 1, min);
      onChange?.(newValue);
      return newValue;
    });
  };

  const handleIncrement = () => {
    setValue((previous) => {
      const newValue = Math.min(previous + 1, max);
      onChange?.(newValue);
      return newValue;
    });
  };

  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm">
      {/* Minus button */}
      <button
        onClick={handleDecrement}
        className="px-3 py-2 text-lg font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none"
      >
        –
      </button>

      {/* Value */}
      <div className="select-none px-4 py-2 text-lg font-semibold text-neutral-900">
        {value}
      </div>

      {/* Plus button */}
      <button
        onClick={handleIncrement}
        className="px-3 py-2 text-lg font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none"
      >
        +
      </button>
    </div>
  );
};
