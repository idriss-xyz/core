import { Icon } from '@idriss-xyz/ui/icon';
import { CollectibleBalance } from '@idriss-xyz/constants';

import { LayersBadge } from '@/app/creators/donate/components/donate-form/components';
import { formatFiatValue } from '@idriss-xyz/utils';

type CollectibleBalanceGalleryProperties = {
  collectibles: CollectibleBalance[];
};

export default function CollectibleBalanceGallery({
  collectibles,
}: CollectibleBalanceGalleryProperties) {
  return (
    <div className="justify-left flex flex-wrap gap-4 px-4 py-2">
      {collectibles.map((collectible) => {
        return (
          <div
            key={collectible.tokenId}
            className="flex w-[268px] flex-shrink-0 cursor-pointer flex-col gap-2 rounded-xl"
          >
            <div className="bg-gray-100 flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl">
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
                    {collectible.collection}
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
                  <Icon name="OpenSea" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
