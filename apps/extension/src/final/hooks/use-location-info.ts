import { useTwitterLocationInfo } from 'host/twitter';
import { EMPTY_LOCATION } from 'shared/location';

export const useLocationInfo = () => {
  const twitterLocationInfo = useTwitterLocationInfo();

  if (twitterLocationInfo.isHost) {
    return {
      ...twitterLocationInfo,
      isTwitter: true,
    };
  }

  return {
    ...EMPTY_LOCATION,
    isTwitter: false,
  };
};
