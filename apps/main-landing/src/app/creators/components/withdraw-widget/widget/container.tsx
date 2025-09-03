import { ReactNode, memo, useCallback } from 'react';
import { Modal } from '@idriss-xyz/ui/modal';

interface RenderChildrenProperties {
  close: () => void;
}

interface Properties {
  isOpened: boolean;
  onClose?: () => void;
  children: (v: RenderChildrenProperties) => ReactNode;
  header?: ReactNode;
}

export const Container = memo(
  ({ children, onClose, header, isOpened }: Properties) => {
    const close = useCallback(() => {
      onClose?.();
    }, [onClose]);

    return (
      <Modal
        isOpened={isOpened}
        header={header}
        headerContainerClassName="pl-6 pt-5.5 pb-2.5"
        closeOnClickAway
        onClose={close}
        withoutPortal
        className="flex w-[350px] flex-col rounded-xl border border-black/20 bg-white"
      >
        <div>{children({ close })}</div>
      </Modal>
    );
  },
);

Container.displayName = 'SendContainer';
