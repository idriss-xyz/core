import * as Portal from '@radix-ui/react-portal';

import { usePortal } from '../../providers';
import { IconButton } from '../icon-button';

import { ModalProperties } from './modal.types';

export const Modal = ({
  children,
  title,
  isOpened,
  onClose,
}: ModalProperties) => {
  const { portal } = usePortal();

  if (!isOpened) {
    return null;
  }

  return (
    <Portal.Root container={portal}>
      <div className="fixed inset-0 bg-zinc-800/60" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 text-gray-900 shadow-lg">
        <div>{title}</div>
        <div className="mt-4">{children}</div>
        <IconButton
          onClick={onClose}
          className="absolute right-2 top-2 flex cursor-pointer items-center justify-center bg-transparent hover:enabled:bg-black/10"
          iconProps={{
            name: 'Cross2Icon',
            size: 16,
            className: 'text-[#aaa]',
          }}
        />
      </div>
    </Portal.Root>
  );
};
