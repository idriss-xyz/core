import { create as createModal, useModal } from '@ebay/nice-modal-react';
import { WalletConnectModal as DesignSystemWalletConnectModal } from '@idriss-xyz/ui/wallet-connect-modal';
import { createStore, EIP6963ProviderInfo } from 'mipd';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { getAddress, hexToNumber } from 'viem';

import { Wallet, SolanaWallet, SolanaProviderInfo } from './types';
import { BROWSER_PROVIDER_LOGO } from './constants';
import { createSolanaWalletStore } from './utils';

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

export const SolanaWalletConnectModal = createModal(() => {
  const modal = useModal();
  const [isConnecting, setIsConnecting] = useState(false);

  const resolveWallet = useCallback(
    (wallet: SolanaWallet) => {
      modal.resolve(wallet);
      modal.remove();
    },
    [modal],
  );

  const walletProvidersStore = useMemo(() => {
    return createSolanaWalletStore();
  }, []);

  const announcedProviders = useSyncExternalStore(
    walletProvidersStore.subscribe,
    walletProvidersStore.getProviders,
  );

  const solanaWalletProviders = announcedProviders.map((wallet) => {
    return {
      provider: wallet.adapter,
      info: {
        uuid: wallet.adapter.name,
        rdns: wallet.adapter.name,
        icon: wallet.adapter.icon as `data:image/${string}`,
        name: wallet.adapter.name,
      },
    };
  });

  const availableProviders = useMemo(() => {
    if (!window.solana) {
      return solanaWalletProviders;
    }

    const providers = window.solana
      ? [
          ...solanaWalletProviders,
          {
            provider: window.solana,
            info: {
              uuid: 'browser',
              rdns: 'browser',
              icon: BROWSER_PROVIDER_LOGO,
              name: 'Browser Wallet',
            },
          },
        ]
      : solanaWalletProviders;

    return providers;
  }, [solanaWalletProviders]);

  const connect = useCallback(
    async (providerInfo: SolanaProviderInfo) => {
      setIsConnecting(true);
      try {
        const foundProviderObject =
          providerInfo.name === 'browser'
            ? {
                provider: window.solana,
                info: {
                  uuid: 'browser',
                  rdns: 'browser',
                  icon: BROWSER_PROVIDER_LOGO,
                  name: 'Browser Wallet',
                },
              }
            : availableProviders.find((provider) => {
                return provider.info.name === providerInfo.name;
              });

        if (!foundProviderObject?.provider) {
          setIsConnecting(false);
          return;
        }
        const { provider } = foundProviderObject;
        await provider.connect();
        const publicKey = provider.publicKey?.toString();
        void resolveWallet({
          account: publicKey ?? '',
          provider,
        });
      } catch {
        setIsConnecting(false);
      }
    },
    [availableProviders, resolveWallet],
  );

  const mappedProviders = availableProviders.map((wallet) => {
    return {
      uuid: wallet.info.name,
      rdns: wallet.info.name,
      icon: wallet.info.icon,
      name: wallet.info.name,
    };
  });

  const closeModalWithoutFinishing = useCallback(() => {
    modal.reject();
    modal.remove();
  }, [modal]);

  return (
    <DesignSystemWalletConnectModal
      onClose={closeModalWithoutFinishing}
      isOpened={modal.visible}
      walletProviders={mappedProviders}
      onConnect={connect}
      isConnecting={isConnecting}
    />
  );
});
