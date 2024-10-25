import { GitcoinDonationWidgetData } from 'application/gitcoin';
import { IdrissSendWidgetData } from 'application/idriss-send';

export type UserWidgetData = GitcoinDonationWidgetData | IdrissSendWidgetData;

export type ProposalSource = 'snapshot' | 'tally' | 'agora';

export interface PostWidgetProposalData {
  top: number;
  username: string;
  officialNames: Record<ProposalSource, string | undefined>;
  proposalsSources: ProposalSource[];
}
