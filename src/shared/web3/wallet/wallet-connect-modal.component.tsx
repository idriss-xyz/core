import { EIP1193Provider, createStore } from 'mipd';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { create as createModal, useModal } from '@ebay/nice-modal-react';
import { useMutation } from '@tanstack/react-query';

import {
  Button,
  Checkbox,
  Icon,
  IdrissLogo,
  Modal,
} from 'shared/ui/components';
import { classes } from 'shared/ui/utils';

import { Wallet } from '../web3.types';
import { hexStringToNumber, toAddressWithValidChecksum } from '../web3.utils';

export const WalletConnectModal = createModal(() => {
  const modal = useModal();
  const [chosenProviderRdns, setChosenProviderRdns] = useState<string>();
  const [termsOfUseAccepted, setTermsOfUseAccepted] = useState(false);

  const connect = useMutation({
    mutationFn: async (provider: EIP1193Provider) => {
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      const chainId = await provider.request({ method: 'eth_chainId' });
      return { accounts, chainId: hexStringToNumber(chainId) };
    },
    onSuccess: ({ accounts, chainId }, provider) => {
      // auto select account if there is only a single one
      if (accounts.length === 1 && accounts[0]) {
        void resolveWallet({
          account: toAddressWithValidChecksum(accounts[0]),
          provider,
          chainId,
        });
      }
    },
  });

  const availableAccounts = useMemo(() => {
    if (!connect.data) {
      return [];
    }

    return connect.data.accounts.map((account) => {
      return toAddressWithValidChecksum(account);
    });
  }, [connect.data]);

  const connectedProvider = connect.variables;
  const connectedProviderChainId = connect.data?.chainId;

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

  const availableWalletProviders = useSyncExternalStore(
    walletProvidersStore.subscribe,
    walletProvidersStore.getProviders,
  );

  const providers = [...availableWalletProviders].sort((a) => {
    if (a.info.rdns === 'io.metamask') {
      return -1;
    }
    return 0;
  });

  const closeModalWithoutFinishing = useCallback(() => {
    modal.reject();
    modal.remove();
  }, [modal]);

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <IdrissLogo size={24} />
          <p className="text-lg font-semibold">Connect wallet</p>
        </div>
      }
      onClose={closeModalWithoutFinishing}
      isOpened={modal.visible}
    >
      <div className="flex flex-col space-y-2">
        {providers.length === 0 && (
          <p>We couldn&apos;t find any wallet provider.</p>
        )}
        {connectedProvider && connectedProviderChainId ? (
          <>
            {availableAccounts.map((account) => {
              return (
                <button
                  className="flex items-center space-x-4 rounded bg-[#555] px-4 py-2.5 shadow-md hover:bg-[#777]"
                  onClick={() => {
                    void resolveWallet({
                      account,
                      provider: connectedProvider,
                      chainId: connectedProviderChainId,
                    });
                  }}
                  key={account}
                >
                  <span className="truncate">{account}</span>
                </button>
              );
            })}
          </>
        ) : (
          <>
            {providers.map(({ info }) => {
              return (
                <button
                  className={classes(
                    'flex items-center space-x-4 rounded bg-transparent px-4 py-2.5 shadow-md hover:bg-[#53535a] disabled:opacity-50',
                    chosenProviderRdns === info.rdns && 'bg-[#53535a]',
                  )}
                  key={info.uuid}
                  onClick={() => {
                    setChosenProviderRdns(info.rdns);
                  }}
                  disabled={connect.isPending}
                >
                  <img src={info.icon} className="size-8" />
                  <span>{info.name}</span>
                </button>
              );
            })}
            {window.ethereum ? (
              <button
                className={classes(
                  'flex items-center space-x-4 rounded bg-transparent px-4 py-2.5 shadow-md hover:bg-[#53535a] disabled:opacity-50',
                  chosenProviderRdns === 'browser' && 'bg-[#53535a]',
                )}
                onClick={() => {
                  if (window.ethereum) {
                    setChosenProviderRdns('browser');
                  }
                }}
                disabled={connect.isPending}
              >
                <Icon name="GlobeIcon" size={32} />
                <span>Browser wallet</span>
              </button>
            ) : null}
            <div>
              <div className="mb-2 mt-4 flex items-center space-x-2">
                <Checkbox
                  value={termsOfUseAccepted}
                  onChange={setTermsOfUseAccepted}
                />
                <p className="text-sm">
                  I agree to the{' '}
                  <a
                    href="https://www.idriss.xyz/tos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2D9CDB]"
                  >
                    Terms of Use
                  </a>
                </p>
              </div>
            </div>
            <Button
              className="rounded bg-[#2D9CDB] font-medium"
              onClick={() => {
                const providerToConnect =
                  chosenProviderRdns === 'browser'
                    ? window.ethereum
                    : providers.find((provider) => {
                        return provider.info.rdns === chosenProviderRdns;
                      })?.provider;

                if (!providerToConnect) {
                  return;
                }
                connect.mutate(providerToConnect);
              }}
              disabled={!termsOfUseAccepted || !chosenProviderRdns}
            >
              Continue
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
});
