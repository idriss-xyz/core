import { WARPCAST_HOST_NAME } from './constants';
import { WarpcastHostName } from './types';

export const isWarpcastHostname = (
  hostname: string,
): hostname is WarpcastHostName => {
  return hostname === WARPCAST_HOST_NAME;
};
