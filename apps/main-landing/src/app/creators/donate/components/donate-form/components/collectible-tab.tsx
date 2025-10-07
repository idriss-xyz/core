import { NftBalance } from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { LayersBadge } from './layer-badge';

const SelectCollectibleButton = ({
  isConnected,
  openConnectModal,
  setIsCollectibleModalOpen,
  setPendingCollectibleModal,
}: {
  isConnected: boolean;
  openConnectModal?: () => void;
  setIsCollectibleModalOpen: (open: boolean) => void;
  setPendingCollectibleModal: (pending: boolean) => void;
}) => {
  return (
    <div
      className={classes(
        'group flex cursor-pointer flex-col items-center justify-center gap-[10px] rounded-2xl border border-neutral-300 bg-neutral-100 px-12 py-6 hover:border-mint-600',
      )}
      onClick={() => {
        if (!isConnected) {
          setPendingCollectibleModal(true);
          openConnectModal?.();
          return;
        }
        return setIsCollectibleModalOpen(true);
      }}
    >
      <IconButton
        intent="tertiary"
        size="medium"
        iconName="Card"
        iconClassName="size-6 group-hover:text-mint-600"
        className="size-12 rounded-xl border border-neutral-200 bg-white"
      />
      <span
        className={classes(
          'text-label5 text-neutral-900 group-hover:text-mint-600',
        )}
      >
        Select a collectible
      </span>
    </div>
  );
};

export const CollectibleTabContent = ({
  selectedCollectible,
  amount,
  setSelectedCollectible,
  setIsCollectibleModalOpen,
  isConnected,
  openConnectModal,
  setPendingCollectibleModal,
}: {
  selectedCollectible: NftBalance | null;
  amount: number | undefined;
  setSelectedCollectible: (collectible: NftBalance | null) => void;
  setIsCollectibleModalOpen: (open: boolean) => void;
  isConnected: boolean;
  openConnectModal?: () => void;
  setPendingCollectibleModal: (pending: boolean) => void;
}) => {
  return (
    <div className="mt-4">
      {selectedCollectible && (
        <div className="flex gap-2.5 rounded-[12px] border border-neutral-200 p-2">
          <img
            src={
              selectedCollectible.imgPreferred ?? selectedCollectible.imgMedium
            }
            alt={selectedCollectible.name}
            className="h-[88px] w-[72px] rounded-[12px] border-neutral-300 object-cover"
          />
          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="flex flex-col gap-[6px]">
              <span className={classes('text-label4 text-neutral-900')}>
                {selectedCollectible.name}
              </span>
              <span className={classes('text-body5 text-neutral-500')}>
                {selectedCollectible.collection}
              </span>
              <div className={classes('h-4.5')}>
                <LayersBadge amount={amount?.toString() ?? '1'} />
              </div>
            </div>
          </div>
          <div className="flex w-10 items-start">
            <IconButton
              intent="tertiary"
              size="medium"
              iconName="Repeat2"
              iconClassName="size-4"
              className="rounded-xl border border-neutral-200 bg-white"
              onClick={() => {
                setSelectedCollectible(null);
                setIsCollectibleModalOpen(true);
              }}
            />
          </div>
        </div>
      )}
      {!selectedCollectible && (
        <SelectCollectibleButton
          isConnected={isConnected}
          openConnectModal={openConnectModal}
          setIsCollectibleModalOpen={setIsCollectibleModalOpen}
          setPendingCollectibleModal={setPendingCollectibleModal}
        />
      )}
    </div>
  );
};
