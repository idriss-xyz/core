import { CREATOR_CHAIN } from '@idriss-xyz/constants';

export const CHAIN_TO_IDRISS_TIPPING_ADDRESS = {
  [CREATOR_CHAIN.ETHEREUM.id]: '0xe18036D7E3377801a19d5Db3f9b236617979674E',
  [CREATOR_CHAIN.BASE.id]: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  [CREATOR_CHAIN.RONIN.id]: '0x74BD1b29B997ec081eb7AF06F2fd67CbfC74D26e',
  [CREATOR_CHAIN.ABSTRACT.id]: '0xEeFA4f7F4e9104D16673D0C2fE3D0bF4c45A7804',
} as const;

export const IDRISS_LEGACY_API_URL = 'https://api.idriss.xyz';

export const WHITELISTED_URLS = [
  'https://static-cdn.jtvnw.net',
  'https://ik.imagekit.io/lens/media-snapshot',
  'https://imagedelivery.net',
  'https://i.imgur.com',
  'https://euc.li',
];
