import { Collectible } from '../../../types';
import { useCollectibles } from '../../../hooks/use-collectibles';

interface Properties {
  collections: string[];
  searchQuery: string;
  onSelect: (collectible: Collectible) => void;
}

export const CollectibleGallery = ({
  collections,
  searchQuery,
  onSelect,
}: Properties) => {
  const { data: collectibles, isLoading } = useCollectibles(collections);

  const filteredCollectibles =
    collectibles?.filter((collectible) => {
      return collectible.name.toLowerCase().includes(searchQuery.toLowerCase());
    }) ?? [];

  if (isLoading) {
    return <div className="py-8 text-center">Loading collectibles...</div>;
  }

  if (filteredCollectibles.length === 0) {
    return (
      <div className="py-8 text-center text-neutral-500">
        No collectibles found
      </div>
    );
  }

  return (
    <div className="grid max-h-96 grid-cols-3 gap-4 overflow-y-auto">
      {filteredCollectibles.map((collectible) => {
        return (
          <div
            key={collectible.id}
            className="cursor-pointer rounded-lg border border-neutral-200 p-2 transition-colors hover:border-mint-500"
            onClick={() => {
              return onSelect(collectible);
            }}
          >
            <img
              src={collectible.image}
              alt={collectible.name}
              className="mb-2 aspect-square w-full rounded-md object-cover"
            />
            <p className="truncate text-sm font-medium">{collectible.name}</p>
            <p className="truncate text-xs text-neutral-500">
              {collectible.collection}
            </p>
          </div>
        );
      })}
    </div>
  );
};
