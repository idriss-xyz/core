import { classes } from '@idriss-xyz/ui/utils';
import { Icon, type IconName } from '@idriss-xyz/ui/icon';

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
    <div
      className={classes(
        'bg-neutral-50 flex w-[360px] items-center rounded-xl border border-neutral-200',
        className,
      )}
    >
      <span className="grow truncate p-3 text-sm">{value}</span>
      <div
        className="flex shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 px-3"
        onClick={handleCopy}
      >
        {copied ? (
          <Icon name="Check" size={16} />
        ) : (
          <Icon name={iconName ?? 'Copy'} size={16} />
        )}
      </div>
    </div>
  );
}
