import { classes } from '@idriss-xyz/ui/utils';
import { Icon, type IconName } from '@idriss-xyz/ui/icon';
import { Alert } from '@idriss-xyz/ui/alert';

import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';

type CopyInputProperties = {
  value: string;
  className?: string;
  onTextClick?: () => void;
  onIconClick?: () => void;
  iconName?: IconName;
  wasCopied?: boolean;
};

export function CopyInput({
  value,
  className,
  onTextClick,
  onIconClick,
  iconName,
  wasCopied,
}: CopyInputProperties) {
  const { copied, copy } = useCopyToClipboard();

  const doCopy = () => {
    void copy(value);
  };

  const handleIconClick = () => {
    if (onIconClick) onIconClick();
    else doCopy();
  };

  const handleTextClick = () => {
    if (onTextClick) onTextClick();
    else doCopy();
  };

  return (
    <div
      className={classes(
        'bg-neutral-50 flex w-[360px] items-center rounded-xl border border-neutral-200',
        className,
      )}
    >
      <span
        className="grow cursor-pointer truncate p-3 text-sm"
        onClick={handleTextClick}
      >
        {value}
      </span>
      <div
        className="flex shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 px-3"
        onClick={handleIconClick}
      >
        {copied || wasCopied ? (
          <Icon name="Check" size={16} />
        ) : (
          <Icon name={iconName ?? 'Copy'} size={16} />
        )}
      </div>

      {/* Copy Alert */}
      {copied && (
        <div className="fixed bottom-[3vh] left-1/2 z-50">
          <Alert
            type="success"
            heading="Your link has been copied!"
            autoClose
          />
        </div>
      )}
    </div>
  );
}
