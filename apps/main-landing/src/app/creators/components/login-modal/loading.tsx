import { Modal } from '@idriss-xyz/ui/modal';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { useAuth } from '../../context/auth-context';

type Properties = {
  isProcessing: boolean;
};

export const LoadingModal = ({ isProcessing }: Properties) => {
  const { oauthError, clearOauthError } = useAuth();

  const onClose = () => {
    if (oauthError) {
      clearOauthError();
    }
  };

  return (
    <Modal
      className="z-scrollbar flex min-h-[200px] w-[400px] flex-col justify-center gap-y-3 rounded-lg border border-black/20 bg-white p-5"
      isOpened={isProcessing || oauthError !== null}
      closeOnClickAway={false}
      onClose={onClose}
    >
      <div className="flex flex-col items-center justify-center">
        {oauthError ? (
          <>
            <IconButton
              intent="tertiary"
              size="medium"
              iconName="X"
              className="absolute right-3 top-3"
              onClick={onClose}
            />
            <h1 className="text-heading4 text-red-500">
              There was an error creating your profile. Try again later.
            </h1>
          </>
        ) : (
          <h1 className="text-heading4 text-neutral-900">Logging you in</h1>
        )}
      </div>
    </Modal>
  );
};
