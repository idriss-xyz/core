'use client';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon, type IconName } from '@idriss-xyz/ui/icon';

import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';
import { useToast } from '../../context/toast-context';

type CopyInputProperties = {
  value: string;
  className?: string;
  textClassName?: string;
  onTextClick?: () => void;
  onIconClick?: () => void;
  iconName?: IconName;
  wasCopied?: boolean;
  message?: string;
  openExternal?: boolean;
};

export function CopyInput({
  value,
  message,
  className,
  textClassName,
  onTextClick,
  onIconClick,
  iconName,
  wasCopied,
  openExternal,
}: CopyInputProperties) {
  const { copied, copy } = useCopyToClipboard();
  const { toast } = useToast();

  const doCopy = () => {
    void copy(value);
    toast({
      type: 'success',
      heading: message ?? 'Your link has been copied',
      autoClose: true,
    });
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
        className={classes("grow cursor-pointer truncate p-3 text-sm", textClassName,)}
        onClick={handleTextClick}
      >
        {value}
      </span>
      <div
        className="flex shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 px-3 hover:text-mint-600"
        onClick={handleIconClick}
      >
        {copied || wasCopied ? (
          <Icon name="Check" size={16} />
        ) : (
          <Icon name={iconName ?? 'Copy'} size={16} />
        )}
      </div>
      {openExternal && (
        <div
          className="flex shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 px-3 hover:text-mint-600"
          onClick={() => {
            return window.open(value, '_blank', 'noreferrer,noopener');
          }}
        >
          <a
            href={value}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center"
          >
            <Icon name="ExternalLink" size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
