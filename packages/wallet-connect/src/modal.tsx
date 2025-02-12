import { create as createModal, useModal } from '@ebay/nice-modal-react';
import { WalletConnectModal as DesignSystemWalletConnectModal } from '@idriss-xyz/ui/wallet-connect-modal';
import { createStore, EIP6963ProviderInfo } from 'mipd';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { getAddress, hexToNumber } from 'viem';

import { Wallet, SolanaWallet, SolanaProviderInfo } from './types';
import { BROWSER_PROVIDER_LOGO } from './constants';

type Properties = {
  disabledWalletsRdns: string[];
};

export const WalletConnectModal = createModal(
  ({ disabledWalletsRdns }: Properties) => {
    const modal = useModal();
    const [isConnecting, setIsConnecting] = useState(false);

    const resolveWallet = useCallback(
      async (wallet: Wallet) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        modal.resolve(wallet);
        modal.remove();
      },
      [modal],
    );

    const walletProvidersStore = useMemo(() => {
      return createStore();
    }, []);

    const announcedProviders = useSyncExternalStore(
      walletProvidersStore.subscribe,
      walletProvidersStore.getProviders,
    );

    const availableProviders = useMemo(() => {
      if (!window.ethereum) {
        return announcedProviders;
      }

      const providers = window.ethereum
        ? [
            ...announcedProviders,
            {
              provider: window.ethereum,
              info: {
                uuid: 'browser',
                rdns: 'browser',
                icon: BROWSER_PROVIDER_LOGO,
                name: 'Browser Wallet',
              },
            },
          ]
        : announcedProviders;

      return providers
        .filter((provider) => {
          return !disabledWalletsRdns.some((disabledRdns) => {
            return provider.info.rdns.includes(disabledRdns);
          });
        })
        .sort((a) => {
          if (a.info.rdns === 'io.metamask') {
            return -1;
          }
          return 0;
        });
    }, [announcedProviders, disabledWalletsRdns]);

    const connect = useCallback(
      async (providerInfo: EIP6963ProviderInfo) => {
        setIsConnecting(true);
        try {
          const foundProviderObject =
            providerInfo.rdns === 'browser'
              ? { provider: window.ethereum }
              : availableProviders.find((provider) => {
                  return provider.info.rdns === providerInfo.rdns;
                });

          if (!foundProviderObject?.provider) {
            setIsConnecting(false);
            return;
          }
          const { provider } = foundProviderObject;
          const accounts = await provider.request({
            method: 'eth_requestAccounts',
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
          const chainId = await provider.request({ method: 'eth_chainId' });
          void resolveWallet({
            account: getAddress(accounts[0] ?? '0x'),
            provider,
            chainId: hexToNumber(chainId),
            providerRdns: providerInfo.rdns ?? '',
          });
        } catch {
          setIsConnecting(false);
        }
      },
      [availableProviders, resolveWallet],
    );

    const closeModalWithoutFinishing = useCallback(() => {
      modal.reject();
      modal.remove();
    }, [modal]);

    const providersInfos: EIP6963ProviderInfo[] = useMemo(() => {
      return availableProviders.map((provider) => {
        return provider.info;
      });
    }, [availableProviders]);

    return (
      <DesignSystemWalletConnectModal
        onClose={closeModalWithoutFinishing}
        isOpened={modal.visible}
        walletProviders={providersInfos}
        onConnect={connect}
        isConnecting={isConnecting}
      />
    );
  },
);

interface SolAdapter {
  name: string;
  icon: string;
}

interface SolWallet {
  adapter: SolAdapter;
  readyState: any;
}

type SolanaProperties = {
  connectWallet: () => Promise<void>;
  selectWallet: (walletName: any) => void;
  wallets: SolWallet[];
};

export const SolanaWalletConnectModal = createModal(
  ({ connectWallet, selectWallet, wallets }: SolanaProperties) => {
  const modal = useModal();
  const solanaWalletProviders = wallets.map((wallet) => ({
    uuid: wallet.adapter.name,
    rdns: wallet.adapter.name,
    icon: `data:image/${wallet.adapter.icon}`,
    name: wallet.adapter.name
  }));

  const [isConnecting, setIsConnecting] = useState(false);

  const resolveWallet = useCallback(
    async (wallet: SolanaWallet) => {
      modal.resolve(wallet);
      modal.remove();
    },
    [modal],
  );
  // TODO: Check not correctly connecting
  const connect = useCallback(async (providerInfo: SolanaProviderInfo) => {
    if (providerInfo.name === 'browser.solana') {
      setIsConnecting(true);
      try {
        const provider = window.solana;
        if (!provider) {
          setIsConnecting(false);
          return;
        }
        const response = await provider.connect();
        void resolveWallet({
          account: response.publicKey,
          provider,
        });
      } catch {
        setIsConnecting(false);
      }
    }
    else {
      selectWallet(providerInfo.name); // TODO: check here
      await connectWallet();
    }

  }, [resolveWallet]);

  const closeModalWithoutFinishing = useCallback(() => {
    modal.reject();
    modal.remove();
  }, [modal]);

  const injectedProvider = {
    uuid: 'browser.solana',
    rdns: 'browser.solana',
    icon: BROWSER_PROVIDER_LOGO,
    name: 'Browser Solana Wallet'
  };
  return (
    <DesignSystemWalletConnectModal
      onClose={closeModalWithoutFinishing}
      isOpened={modal.visible}
      walletProviders={[injectedProvider, ...solanaWalletProviders]}
      onConnect={connect}
      isConnecting={isConnecting}
    />
  );
});
