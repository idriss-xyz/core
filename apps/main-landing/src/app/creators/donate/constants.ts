import { CREATOR_CHAIN } from '@idriss-xyz/constants';

export const CHAIN_TO_IDRISS_TIPPING_ADDRESS = {
  [CREATOR_CHAIN.ETHEREUM.id]: '0xBDc14c9946A957C7038900dE19Fb2Aa3f72CFAc2',
  [CREATOR_CHAIN.BASE.id]: '0x1A5dc020dcd36C997f6349801583738CFb4bD44a',
  [CREATOR_CHAIN.RONIN.id]: '0x7DE583608091c21A09040Bf24A178a9156c18219',
  [CREATOR_CHAIN.ABSTRACT.id]: '0xBDc14c9946A957C7038900dE19Fb2Aa3f72CFAc2',
  // [CREATOR_CHAIN.AVALANCHE.id]: '0xBDc14c9946A957C7038900dE19Fb2Aa3f72CFAc2',
} as const;

export const IDRISS_LEGACY_API_URL = 'https://api.idriss.xyz';

export const WHITELISTED_URLS = [
  'https://static-cdn.jtvnw.net',
  'https://ik.imagekit.io/lens/media-snapshot',
  'https://imagedelivery.net',
  'https://i.imgur.com',
  'https://euc.li',
];
