import { classes } from 'shared/ui/utils';
import { Chip, WidgetBase } from 'shared/ui/components';

import { ProposalData } from '../types';
import {
  getDaysUntil,
  getEndsInLabel,
  getProposalAuthor,
  getProposalUrl,
  getUserUrl,
} from '../utils';

interface Properties {
  data: ProposalData;
  className?: string;
  top?: number;
  onHide?: () => void;
}

export const Proposal = ({ data, className, top, onHide }: Properties) => {
  return (
    <WidgetBase
      className={classes(
        'rounded-lg bg-[#2d2d2d] text-xs leading-tight',
        className,
      )}
      top={top}
      onHide={onHide}
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
        <p className="text-base font-semibold">{data.title}</p>
        <p className="mt-1 overflow-hidden text-[#ccc]">
          ${data.body.slice(0, 120)}...
        </p>
      </main>
      <footer className="mt-2 flex items-center space-x-2">
        <div className="text-[#aaa]">
          {getEndsInLabel(getDaysUntil(data.end * 1000))}
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
