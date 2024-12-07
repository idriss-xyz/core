import { TALLY_GRAPHQL_API_URL, TALLY_WEBSITE_URL } from './constants';
import { ProposalData } from './types';

export const generateGetProposalsQuery = ({
  username,
  afterCursor,
}: {
  username: string;
  afterCursor: string | null;
}) => {
  return `${TALLY_GRAPHQL_API_URL}?twitter-name=${username}${afterCursor ? `&afterCursor=${afterCursor}` : ''}`;
};

export const getProposalUrl = (userName: string, proposalId: string) => {
  return `${TALLY_WEBSITE_URL}/gov/${userName}/proposal/${proposalId}`;
};

const getOrganizationUrl = (organizationName: string) => {
  return `${TALLY_WEBSITE_URL}/gov/${organizationName}`;
};

const getOrganizationDelegateUrl = (
  organizationName: string,
  delegateEns: string,
) => {
  return `${TALLY_WEBSITE_URL}/gov/${organizationName}/delegate/${delegateEns}`;
};

export const getProposalAuthorUrl = (proposalDetails: ProposalData) => {
  return proposalDetails.creator.ens.length > 0 ||
    proposalDetails.creator.address.length > 0
    ? getOrganizationDelegateUrl(
        proposalDetails.organization.slug ?? '',
        proposalDetails.creator.ens.length > 0
          ? proposalDetails.creator.ens
          : proposalDetails.creator.address,
      )
    : getOrganizationUrl(proposalDetails.organization.slug ?? '');
};

const formatProposerAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(Math.max(0, address.length - 4))}`;
};

export const getProposalAuthorLabel = (proposalDetails: ProposalData) => {
  return proposalDetails.creator.name.length > 0
    ? proposalDetails.creator.name
    : formatProposerAddress(proposalDetails.creator.address);
};
