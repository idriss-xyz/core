import { classes } from '@idriss-xyz/ui/utils';
import { useMemo } from 'react';

import { EligibilityCheckResponse } from '@/app/claim/types';

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
    {
      communityName: 'Aavegotchi',
      isActiveMember: eligibilityData.aavegotchi,
    },
    {
      communityName: 'Agora',
      isActiveMember: eligibilityData.agora,
    },
    {
      communityName: 'Farcaster',
      isActiveMember: eligibilityData.farcaster,
    },
    {
      communityName: 'Gitcoin',
      isActiveMember: eligibilityData.gitcoin,
    },
    {
      communityName: 'Jumper',
      isActiveMember: eligibilityData.jumper,
    },
    {
      communityName: 'Snapshot',
      isActiveMember: eligibilityData.snapshot,
    },
    {
      communityName: 'Tally',
      isActiveMember: eligibilityData.tally,
    },
  ].filter((community) => {
    return community.isActiveMember;
  });

  const activeCommunitiesList = useMemo(() => {
    switch (communities.length) {
      case 0: {
        return (
          <span>
            of{'\u00A0'}a{'\u00A0'}partner{'\u00A0'}community
          </span>
        );
      }

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
            of{'\u00A0'}the {communities[0]?.communityName}
            {'\u00A0'}and{'\u00A0'}
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

      default: {
        const firstCommunities = communities
          .slice(0, -1)
          .map((community) => community.communityName);
        const lastCommunity =
          communities[communities.length - 1]?.communityName;
        return (
          <span>
            of{'\u00A0'}the {firstCommunities.join(', ')}, and {lastCommunity}{' '}
            communities
          </span>
        );
      }
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
