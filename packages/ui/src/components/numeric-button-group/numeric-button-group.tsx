import { useEffect, useState } from 'react';

import { Icon } from '../icon';

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
      className={`inline-flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white ${className ?? ''}`}
    >
      {/* Minus button */}
      <button
        onClick={handleDecrement}
        className="px-2 py-1 font-medium text-neutralGreen-900 hover:bg-neutral-100 focus:outline-none"
      >
        <Icon name="Minus" size={16} />
      </button>

      {/* Divider */}
      <div className="h-7 w-px bg-neutral-300" />

      {/* Value */}
      <div className="select-none px-3 py-1.5 text-body5 font-semibold text-neutralGreen-900">
        {internalValue}
      </div>

      {/* Divider */}
      <div className="h-7 w-px bg-neutral-300" />

      {/* Plus button */}
      <button
        onClick={handleIncrement}
        className="px-2 py-1 font-medium text-neutralGreen-900 hover:bg-neutral-100 focus:outline-none"
      >
        <Icon name="Plus" size={16} />
      </button>
    </div>
  );
};
