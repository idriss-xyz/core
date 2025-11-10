import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';

import { useTimeAgo } from '../../donate/hooks/use-time-ago';

export const TimeAgoCell = ({ timestamp }: { timestamp?: string | number }) => {
  const timeAgo = useTimeAgo({ timestamp });

  if (!timestamp) {
    return <>{timeAgo}</>;
  }

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{timeAgo}</span>
        </TooltipTrigger>
        <TooltipContent className="w-fit bg-black text-white">
          <p className="text-body6">
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
              .format(new Date(timestamp))
              .replaceAll('/', '-')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
