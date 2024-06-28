import { Chip, WidgetBase, classes } from 'shared/ui';
import { getDifferenceInDays, getEndsInLabel } from 'shared/utils';

import { ProposalData } from '../types';
import { getProposalAuthor, getProposalUrl, getUserUrl } from '../utils';

interface Properties {
  data: ProposalData;
  className?: string;
  top?: number;
  onClose?: () => void;
}

export const Proposal = ({ data, className, top, onClose }: Properties) => {
  return (
    <WidgetBase
      className={classes(
        'rounded-lg bg-[#2d2d2d] text-xs leading-tight',
        className,
      )}
      top={top}
      onClose={onClose}
    >
      <header className="flex items-center justify-between space-x-3">
        <a
          href={getUserUrl(data.author.address)}
          className="text-[#aaa]"
          target="_blank"
          rel="noopener noreferrer"
        >
          By {getProposalAuthor(data)}
        </a>
        <Chip>Active</Chip>
      </header>
      <main className="mt-2">
        <p className="line-clamp-[1] break-all text-base font-semibold">
          {data.title}
        </p>
        <p className="mt-1 line-clamp-[2] overflow-hidden break-all text-[#ccc]">
          {data.body}
        </p>
      </main>
      <footer className="mt-3.5 flex items-center space-x-2">
        <div className="text-[#aaa]">
          {getEndsInLabel(getDifferenceInDays(data.end * 1000))}
        </div>
        <a
          href={getProposalUrl(data.space.id, data.id)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Chip className="py-1" variant="info" width="long">
            Vote
          </Chip>
        </a>
      </footer>
    </WidgetBase>
  );
};
