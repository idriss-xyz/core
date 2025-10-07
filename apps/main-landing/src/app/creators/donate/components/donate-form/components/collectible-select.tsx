import { Modal } from '@idriss-xyz/ui/modal';
import { Input } from '@idriss-xyz/ui/input';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';
import { UseFormReturn } from 'react-hook-form';
import { NftBalance } from '@idriss-xyz/constants';

import { FormPayload } from '@/app/creators/donate/schema';

import { CollectibleGallery } from './collectible-gallery';

type Properties = {
  isOpen: boolean;
  onClose: () => void;
  collectibleSearch: string;
  setCollectibleSearch: (value: string) => void;
  showMobileFilter: boolean;
  setShowMobileFilter: (value: boolean) => void;
  collectionFilters: string[];
  setCollectionFilters: (filters: string[]) => void;
  formMethods: UseFormReturn<FormPayload>;
  setSelectedCollectible: (collectible: NftBalance | null) => void;
};

export function CollectibleSelectModal({
  isOpen,
  onClose,
  collectibleSearch,
  setCollectibleSearch,
  showMobileFilter,
  setShowMobileFilter,
  collectionFilters,
  setCollectionFilters,
  formMethods,
  setSelectedCollectible,
}: Properties) {
  return (
    <Modal
      isOpened={isOpen}
      onClose={onClose}
      header={
        <p className={classes('truncate text-heading5 text-neutralGreen-900')}>
          Search collectible
        </p>
      }
      headerContainerClassName="pl-6 pt-5.5 pb-2.5"
      className="h-[550px] w-[400px] sm:w-[500px] md:w-[827px]"
    >
      <div className="p-6">
        <div className="mb-4 flex w-full gap-2">
          {/* Mobile Filter Button - only visible below md */}
          <IconButton
            intent="tertiary"
            size="small"
            iconName="Filter"
            onClick={() => {
              return setShowMobileFilter(true);
            }}
            className="shrink-0 md:hidden"
          />
          <Input
            placeholder="Search collectibles"
            prefixIconName="Search"
            prefixIconSize={16}
            value={collectibleSearch}
            onChange={(event) => {
              return setCollectibleSearch(event.target.value);
            }}
          />
        </div>

        <CollectibleGallery
          searchQuery={collectibleSearch}
          showMobileFilter={showMobileFilter}
          setShowMobileFilter={setShowMobileFilter}
          initialSelectedCollections={collectionFilters}
          onSelectedCollectionsChange={setCollectionFilters}
          onSelect={(collectible) => {
            if (collectible.amount === 0) {
              setSelectedCollectible(null);
              return;
            }
            // do not set chainId here to not change the chainId on the tokenTab.
            // Sending collectibles already uses selectedCollectible?.chainId instead of the payload chainId
            formMethods.setValue('tokenId', collectible.tokenId);
            formMethods.setValue('contract', collectible.contract);
            formMethods.setValue('type', collectible.type ?? 'erc1155');
            formMethods.setValue('collectibleAmount', collectible.amount);
            setSelectedCollectible({
              tokenId: collectible.tokenId,
              name: collectible.name,
              type: collectible.type,
              collection: collectible.collection,
              collectionShortName: collectible.collectionShortName,
              collectionImage: collectible.collectionImage,
              collectionCategory: collectible.collectionCategory,
              contract: collectible.contract,
              chainId: collectible.chainId,
              imgPreferred: collectible.imgPreferred ?? collectible.imgMedium,
              balance: collectible.balance,
            });
          }}
          onConfirm={onClose}
        />
      </div>
    </Modal>
  );
}
