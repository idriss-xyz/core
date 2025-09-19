import { useEffect, useState } from 'react';

type NumericButtonGroupProperties = {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
};

export const NumericButtonGroup = ({
  min = 0,
  max = Infinity,
  value = 0,
  onChange,
  className,
}: NumericButtonGroupProperties) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleDecrement = () => {
    const newValue = Math.max(internalValue - 1, min);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(internalValue + 1, max);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm ${className ?? ''}`}
    >
      {/* Minus button */}
      <button
        onClick={handleDecrement}
        className="px-3 py-2 text-lg font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none"
      >
        –
      </button>

      {/* Value */}
      <div className="select-none px-4 py-2 text-lg font-semibold text-neutral-900">
        {internalValue}
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
