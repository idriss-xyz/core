/* eslint-disable @next/next/no-img-element */
import { Modal } from '@idriss-xyz/ui/modal';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';

import idrissCoin from '../../assets/IDRISS_COIN 1.png';

export const ClaimSuccessfulModal = () => {
  return (
    <Modal
      isOpened
      headerContainerClassName="border-none"
      header={
        <span className="text-heading3 text-neutral-900">Claim successful</span>
      }
      className="flex w-[400px] flex-col items-center rounded-lg p-5"
    >
      <>
        <div className="mt-5 flex flex-col items-center gap-6 self-stretch rounded-lg border border-neutral-200 bg-mint-100 p-6">
          <div className="relative flex w-full flex-row justify-center">
            <img className="size-[83px]" src={idrissCoin.src} alt="" />
            <Icon
              name="Download"
              size={24}
              className="absolute right-0 top-0 flex size-6 text-neutral-800"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-body4 text-neutralGreen-700">
              YOU RECEIVED
            </span>
            <div className="flex flex-col items-center justify-center rounded-[12px] border-[0.683px] border-[rgba(85,235,60,0.30)] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(252,255,242,0.00)_0%,_rgba(23,255,74,0.18)_100%)] p-5.5">
              <span className="text-heading3 gradient-text">
                +1,250.0 $IDRISS
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex w-full flex-col gap-3">
          <Button
            intent="primary"
            size="medium"
            isExternal
            asLink
            className="w-full"
          >
            ADD TO WALLET
          </Button>
          <Button
            intent="secondary"
            size="medium"
            isExternal
            asLink
            className="w-full"
          >
            SHARE WITH FRIEND
          </Button>
        </div>
      </>
    </Modal>
  );
};
