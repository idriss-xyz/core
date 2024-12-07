import { useSupercastLocationInfo } from 'host/supercast';
import { useTwitterLocationInfo } from 'host/twitter';
import { useWarpcastLocationInfo } from 'host/warpcast';
import { EMPTY_LOCATION } from 'shared/location';

export const useLocationInfo = () => {
  const twitterLocationInfo = useTwitterLocationInfo();
  const warpcastLocationInfo = useWarpcastLocationInfo();
  const supercastLocationInfo = useSupercastLocationInfo();

  if (twitterLocationInfo.isHost) {
    return {
      ...twitterLocationInfo,
      isWarpcast: false,
      isTwitter: true,
      isSupercast: false,
    };
  }

  if (warpcastLocationInfo.isHost) {
    return {
      ...warpcastLocationInfo,
      isWarpcast: true,
      isTwitter: false,
      isSupercast: false,
    };
  }

  if (supercastLocationInfo.isHost) {
    return {
      ...supercastLocationInfo,
      isWarpcast: false,
      isTwitter: false,
      isSupercast: true,
    };
  }

  return {
    ...EMPTY_LOCATION,
    isTwitter: false,
    isWarpcast: false,
    isSupercast: false,
  };
};
