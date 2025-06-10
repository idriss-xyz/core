import { Modal } from '@idriss-xyz/ui/modal';

type Properties = {
  isProcessing: boolean;
};

export const LoadingModal = ({ isProcessing }: Properties) => {
  return (
    <Modal
      className="z-scrollbar flex min-h-[200px] w-[400px] flex-col justify-center gap-y-3 rounded-lg border border-black/20 bg-white p-5"
      isOpened={isProcessing}
      closeOnClickAway={false}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-heading4 text-neutral-900">
          Creating your profile
        </h1>
      </div>
    </Modal>
  );
};
