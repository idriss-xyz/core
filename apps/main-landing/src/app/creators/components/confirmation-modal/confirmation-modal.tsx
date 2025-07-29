import { Button } from '@idriss-xyz/ui/button';
import { Modal } from '@idriss-xyz/ui/modal';

type Properties = {
  isOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  sectionSubtitle: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonIntent?: 'primary' | 'secondary' | 'negative';
};

export const ConfirmationModal = ({
  isOpened,
  onClose,
  onConfirm,
  title,
  subtitle,
  sectionSubtitle,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonIntent = 'secondary',
}: Properties) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      className="flex w-[560px] flex-col rounded-xl border border-black/20 bg-white"
      isOpened={isOpened}
      onClose={onClose}
      closeOnClickAway
    >
      <div className="flex w-full items-center justify-between border-neutral-200 p-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-heading4">{title}</h1>
          {subtitle && (
            <p className="text-body4 text-neutral-600">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[10px] pb-5 pl-5 pr-4 text-left">
        <p className="max-w-prose text-body5 text-neutral-600">
          {sectionSubtitle}
        </p>
      </div>
      <div className="flex w-full items-center justify-end gap-3 border-neutral-200 p-5">
        <Button
          size="medium"
          intent={confirmButtonIntent}
          onClick={handleConfirm}
        >
          {confirmButtonText}
        </Button>
        <Button size="medium" intent="primary" onClick={onClose}>
          {cancelButtonText}
        </Button>
      </div>
    </Modal>
  );
};
