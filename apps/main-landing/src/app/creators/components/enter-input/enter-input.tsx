import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';
import { useState, type KeyboardEvent } from 'react';

type EnterInputProperties = {
  initialValue: string;
  className?: string;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
};

// TODO: Remove if not going to be used
// ts-unused-exports:disable-next-line
export function EnterInput({
  initialValue,
  className,
  onSave,
  placeholder,
}: EnterInputProperties) {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    void onSave(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      className={classes(
        'bg-neutral-50 flex items-center rounded-xl border border-neutral-200',
        className,
      )}
    >
      <input
        type="email"
        className="grow truncate bg-transparent p-3 text-sm outline-none"
        value={value}
        onChange={(inputEvent) => {
          return setValue(inputEvent.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <div
        className="flex shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 px-3"
        onClick={handleSave}
      >
        <Icon name="IdrissArrowRight" size={16} />
      </div>
    </div>
  );
}
