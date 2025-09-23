import { Icon } from '@idriss-xyz/ui/icon';
import { CollectibleBalance } from '@idriss-xyz/constants';

import { LayersBadge } from '@/app/creators/donate/components/donate-form/components';

type CollectibleBalanceGalleryProperties = {
  collectibles: CollectibleBalance[];
};

export default function CollectibleBalanceGallery({
  collectibles,
}: CollectibleBalanceGalleryProperties) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {collectibles.map((collectible) => {
        return (
          <div
            key={collectible.tokenId}
            className="flex max-w-[268px] cursor-pointer flex-col gap-2 rounded-xl"
          >
            <div className="h-[328px] overflow-hidden rounded-xl">
              <img
                src={collectible.image}
                alt={collectible.name}
                className="object-cover"
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
                <div className="flex">
                  <span>{collectible.usdValue}</span>
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
