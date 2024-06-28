import {
  classes,
  Chip,
  WidgetBase,
  Pagination,
  PaginationComponent,
  PulsingLoadingBar,
} from 'shared/ui';
import { getDifferenceInDays, getEndsInLabel } from 'shared/utils';

import { ProposalData } from '../types';
import { getProposalUrl } from '../utils';

interface Properties {
  data: ProposalData;
  className?: string;
  top?: number;
  pagination: Pagination;
  isLoading: boolean;
  onClose?: () => void;
}

export const Proposal = ({
  data,
  className,
  top,
  isLoading,
  pagination,
  onClose,
}: Properties) => {
  const proposalEndDateInMs = new Date(
    data.proposalData.endTimestamp,
  ).getTime();

  return (
    <WidgetBase
      className={classes(
        'overflow-hidden rounded-md bg-white text-xs leading-tight',
        className,
      )}
      top={top}
      onClose={onClose}
    >
      <PulsingLoadingBar isLoading={isLoading} />
      <header className="flex items-center justify-between space-x-3">
        <p className="line-clamp-[1] text-xs text-gray-700">
          By {data.proposerAddress}
        </p>
        <Chip className="rounded-sm bg-green-200 px-1 py-0.5 font-semibold uppercase text-green-600">
          {data.proposalData.state}
        </Chip>
      </header>
      <main className="mt-2">
        <p className="line-clamp-[1] break-all text-base font-black text-black">
          {data.proposalData.title}
        </p>
        <p className="mt-1 line-clamp-[2] overflow-hidden break-all text-[#374151]">
          {data.description}
        </p>
      </main>
      <footer className="mt-3.5 flex items-center justify-between">
        <div className="flex justify-start gap-1.5">
          <div className="flex items-center text-xs text-gray-700">
            {getEndsInLabel(getDifferenceInDays(proposalEndDateInMs))}
          </div>
          <a
            href={getProposalUrl(data.proposalId)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Chip
              className="mr-2 inline-flex select-none items-center justify-center rounded-md border px-4 py-1 font-medium transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              variant="info"
              width="long"
            >
              Vote
            </Chip>
          </a>
        </div>
        <PaginationComponent pagination={pagination} />
      </footer>
    </WidgetBase>
  );
};
