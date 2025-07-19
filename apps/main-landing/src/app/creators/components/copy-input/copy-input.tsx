import { Input } from '@idriss-xyz/ui/input';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon, IconName } from '@idriss-xyz/ui/icon';

import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';

type CopyInputProperties = {
  value: string;
  className?: string;
  onClick?: () => void;
  iconName?: IconName;
};

export function CopyInput({
  value,
  className,
  onClick,
  iconName,
}: CopyInputProperties) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    if (onClick) onClick();
    setTimeout(() => {
      void copy(value);
    }, 0);
  };

  return (
    <div className="relative flex">
      <Input
        value={value}
        readOnly
        className={classes('min-w-[380px] max-w-[500px]', className)}
        suffixElement={
          <div
            className="flex h-full items-center py-[2px]"
            onClick={handleCopy}
          >
            <div className="mr-3 h-full border-l border-gray-200" />
            {copied ? (
              <Icon name="Check" size={15} />
            ) : (
              <Icon name={iconName ?? 'Copy'} size={15} />
            )}
          </div>
        }
      />
    </div>
  );
}
