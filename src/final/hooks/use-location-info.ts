import { useTwitterLocationInfo } from 'host/twitter';
import { useWarpcastLocationInfo } from 'host/warpcast';
import { EMPTY_LOCATION } from 'shared/location';

export const useLocationInfo = () => {
  const twitterLocationInfo = useTwitterLocationInfo();
  const warpcastLocationInfo = useWarpcastLocationInfo();

  if (twitterLocationInfo.isHost) {
    return { ...twitterLocationInfo, isWarpcast: false, isTwitter: true };
  }

  if (warpcastLocationInfo.isHost) {
    return { ...warpcastLocationInfo, isWarpcast: true, isTwitter: false };
  }

  return { ...EMPTY_LOCATION, isTwitter: false, isWarpcast: false };
};
