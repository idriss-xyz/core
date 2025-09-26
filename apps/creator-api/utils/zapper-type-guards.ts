import { NftDisplayItem, TokenDisplayItem } from '../types';

export function isTokenItem(
  item: TokenDisplayItem | NftDisplayItem | undefined,
): item is TokenDisplayItem {
  // `tokenV2` is present only on fungible-token display items
  return !!item && 'tokenV2' in item;
}

export function isNftItem(
  item: TokenDisplayItem | NftDisplayItem | undefined,
): item is NftDisplayItem {
  return !!item && 'tokenId' in item;
}
