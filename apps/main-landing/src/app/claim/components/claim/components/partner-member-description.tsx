import { EligibilityCheckResponse } from '@/app/claim/types';
import { classes } from '@idriss-xyz/ui/utils';
import { useMemo } from 'react';

type Properties = {
  eligibilityData: EligibilityCheckResponse;
  liBaseClassName: string;
};

export const PartnerMemberDescription = ({
  eligibilityData,
  liBaseClassName,
}: Properties) => {
  const communities = [
    {
      communityName: 'Parallel',
      isActiveMember: eligibilityData.avatar ?? eligibilityData.ardent,
    },
    {
      communityName: 'Across',
      isActiveMember: eligibilityData.across,
    },
    {
      communityName: 'Polymarket',
      isActiveMember: eligibilityData.polymarket,
    },
  ].filter(Boolean);

  const activeCommunitiesList = useMemo(() => {
    switch (communities.filter(community => community.isActiveMember).length) {
      case 1: {
        return (
          <span>
            of{'\u00A0'}the {communities[0]?.communityName}
            {'\u00A0'}community
          </span>
        );
      }

      case 2: {
        return (
          <span>
            of{'\u00A0'}the {communities[0]?.communityName}{'\u00A0'}and{'\u00A0'}
            {communities[1]?.communityName} communities
          </span>
        );
      }

      case 3: {
        return (
          <span>
            of{'\u00A0'}the {communities[0]?.communityName},{'\u00A0'}
            {communities[1]?.communityName}, and {communities[2]?.communityName}{' '}
            communities
          </span>
        );
      }

      case 0:
      default:
        return (
          <span>
            of{'\u00A0'}a{'\u00A0'}partner{'\u00A0'}community
          </span>
        );
    }
  }, [communities]);

  return (
    <li
      className={classes(
        liBaseClassName,
        eligibilityData.allocation_partner && 'before:text-mint-600',
      )}
    >
      <span>You are a highly engaged member {activeCommunitiesList}</span>
    </li>
  );
};
