import { Button } from '@idriss-xyz/ui/button';

import { Icon, LazyImage } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';
import { GetEnsInfoCommand } from 'application/trading-copilot';

import { TradingCopilotToastProperties } from './trading-copilot-toast.types';

export const TradingCopilotToast = ({
  toast,
  dialogId,
  openDialog,
}: TradingCopilotToastProperties) => {
  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: toast.name,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <div className="grid grid-cols-[48px,1fr] gap-2">
      <LazyImage
        src={avatarQuery.data}
        className="size-12 rounded-full border border-neutral-400 bg-neutral-200"
        fallbackComponent={
          <div className="flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
            <Icon size={30} name="PersonIcon" className="text-neutral-500" />
          </div>
        }
      />
      <div className="flex w-full flex-col gap-y-1">
        <p className="text-label3 text-neutral-900">
          {toast.name}{' '}
          <span className="text-body3 text-neutral-600">
            purchased {toast.amount} {toast.crypto}
          </span>
        </p>
        <div className="flex w-full justify-between">
          <p className="text-body6 text-mint-700">{toast.when}</p>
          <Button
            intent="primary"
            size="small"
            className="uppercase"
            onClick={() => {
              openDialog(dialogId);
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
