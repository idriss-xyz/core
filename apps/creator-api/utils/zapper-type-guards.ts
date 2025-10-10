import {
  NftDisplayItem,
  TokenDisplayItem,
  StringDisplayItem,
  ActorDisplayItem,
  NftCollectionDisplayItem,
} from '../types';

export const isTokenItem = (item: unknown): item is TokenDisplayItem =>
  !!item && (item as any).__typename === 'TokenDisplayItem';

export const isNftItem = (item: unknown): item is NftDisplayItem =>
  !!item && (item as any).__typename === 'NFTDisplayItem';

export const isStringItem = (item: unknown): item is StringDisplayItem =>
  !!item && (item as any).__typename === 'StringDisplayItem';

export const isActorItem = (item: unknown): item is ActorDisplayItem =>
  !!item && (item as any).__typename === 'ActorDisplayItem';

export const isNftCollectionItem = (
  item: unknown,
): item is NftCollectionDisplayItem =>
  !!item && (item as any).__typename === 'NFTCollectionDisplayItem';
