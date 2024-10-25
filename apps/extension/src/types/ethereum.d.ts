import { EIP1193Provider } from 'mipd';

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}
