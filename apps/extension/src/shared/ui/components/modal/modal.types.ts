import { ReactNode } from 'react';

export interface ModalProperties {
  title: ReactNode;
  children: ReactNode;
  isOpened: boolean;
  onClose: () => void;
}
