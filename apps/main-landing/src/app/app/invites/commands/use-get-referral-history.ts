import { getAccessToken } from '@privy-io/react-auth';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { useQuery } from '@tanstack/react-query';

interface ReferralHistoryResponse {
  successfulInvites: number;
  successfulInvitesUsers: {
    displayName: string;
    profilePictureUrl: string;
    numberOfFollowers: number;
    joinDate: string;
    streamStatus: boolean;
    game: { name: string; url: string } | null;
  }[];
  suggestedInvitees: {
    displayName: string;
    profilePictureUrl: string;
    numberOfFollowers: number;
    joinDate: string;
    streamStatus: boolean;
    game: { name: string; url: string } | null;
  }[];
  inviteRank: number;
  networkEarnings: number;
}

export function useGetReferralHistory(options?: { enabled?: boolean }) {
  return useQuery<ReferralHistoryResponse>({
    queryKey: ['referral-stats'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const authToken = await getAccessToken();
      if (!authToken) throw new Error('Unauthorized');
      console.log('Getting now');

      const response = await fetch(`${CREATOR_API_URL}/referral-history`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to load referral history');
      const data: ReferralHistoryResponse = await response.json();
      return data;
    },
  });
}
