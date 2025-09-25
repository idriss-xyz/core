import { Icon } from '@idriss-xyz/ui/icon';
import {
  CHAIN_ID_TO_OPENSEA_NETWORK_NAMES,
  CollectibleBalance,
} from '@idriss-xyz/constants';
import { formatFiatValue } from '@idriss-xyz/utils';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { LayersBadge } from '@/app/creators/donate/components/donate-form/components';

type CollectibleBalanceGalleryProperties = {
  collectibles: CollectibleBalance[];
};

export default function CollectibleBalanceGallery({
  collectibles,
}: CollectibleBalanceGalleryProperties) {
  return (
    <div className="flex flex-wrap justify-start gap-4 px-4 py-2">
      {collectibles.map((collectible) => {
        return (
          <div
            key={collectible.tokenId}
            className="flex w-[268px] shrink-0 flex-col gap-2 rounded-xl"
          >
            <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200">
              <img
                src={collectible.image}
                alt={collectible.name}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col gap-3 px-1 py-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-label4 text-neutral-900">
                    {collectible.name}
                  </p>
                  <p className="truncate text-body5 text-neutral-600">
                    {collectible.collectionShortName}
                  </p>
                </div>
                {collectible.type === 'erc1155' &&
                  Number(collectible.balance) > 1 && (
                    <LayersBadge amount={collectible.balance} />
                  )}
              </div>
              <div className="flex items-center justify-between">
                <Icon name="Parallel" size={20} />
                <div className="flex gap-2">
                  <span>
                    {collectible.usdValue
                      ? formatFiatValue(collectible.usdValue)
                      : ''}
                  </span>
                  <IconButton
                    intent="tertiary"
                    size="medium"
                    iconName="OpenSea"
                    className="p-0"
                    onClick={() => {
                      window.open(
                        'https://opensea.io/item/' +
                          CHAIN_ID_TO_OPENSEA_NETWORK_NAMES[
                            collectible.chainId
                          ] +
                          '/' +
                          collectible.contract +
                          '/' +
                          collectible.tokenId,
                        '_blank',
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
