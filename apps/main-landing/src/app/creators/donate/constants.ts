import { CREATOR_CHAIN } from '@idriss-xyz/constants';

export const CHAIN_TO_IDRISS_TIPPING_ADDRESS = {
  [CREATOR_CHAIN.ETHEREUM.id]: '0x9DDFE520280ef061119526C70d8160760348BB63',
  [CREATOR_CHAIN.BASE.id]: '0x6d17647ff4970b7A29911d52126EAe97eEb78B57',
  [CREATOR_CHAIN.RONIN.id]: '0xbdc14c9946a957c7038900de19fb2aa3f72cfac2',
  [CREATOR_CHAIN.ABSTRACT.id]: '0x9DDFE520280ef061119526C70d8160760348BB63',
  // [CREATOR_CHAIN.AVALANCHE.id]: '0x74BD1b29B997ec081eb7AF06F2fd67CbfC74D26e',
} as const;

export const IDRISS_LEGACY_API_URL = 'https://api.idriss.xyz';

export const WHITELISTED_URLS = [
  'https://static-cdn.jtvnw.net',
  'https://ik.imagekit.io/lens/media-snapshot',
  'https://imagedelivery.net',
  'https://i.imgur.com',
  'https://euc.li',
];
