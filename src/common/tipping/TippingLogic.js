import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js";
import {CoinbaseWalletProvider} from "@depay/coinbase-wallet-sdk"

export const TippingLogic = {

    async prepareTip(chain, coin, address, amountUSD) {
        console.log('prepareTip')
    },
    tallyOpts: {
        "custom-tally": {
            display: {
                logo: "../static/images/tally.svg",
                name: "Tally",
                description: "Coming Soon"
            },
            package: true,
            connector: async () => {
                if (!TippingLogic.isTallyInstalled()) {
                    window.open("https://tally.cash/community-edition", '_blank'); // <-- LOOK HERE
                    throw new Error("Tally not supported yet.");
                }

                let provider = null;
                if (typeof window.ethereum !== 'undefined') {
                    /*
                    provider = window.ethereum
                    try {
                        await provider.request({ method: 'eth_requestAccounts' });
                    } catch (error) {
                        throw new Error("User Rejected");
                    }
                    */
                    throw new Error("Tally not supported yet.");
                } else {
                    throw new Error("No Tally Wallet found");
                }
                console.log("Tally provider", provider);
                return provider;
            }
        }
    },
    walletConnectOpts: {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    1: 'https://eth-mainnet.alchemyapi.io/v2/NcZapwC9N6OhvtRKvjGhc23st5VmG2hB'
                },
                network: "mainnet",
            }
        }
    },
    metaMaskOpts: {
        "custom-metamask": {
            display: {
                logo: "../static/images/metamask-logo.svg",
                name: "MetaMask",
                description: "Connect to your MetaMask Wallet"
            },
            package: true,
            connector: async () => {
                // if (!TippingLogic.isMetaMaskInstalled()) {
                //     window.open("https://metamask.io/download/", '_blank'); // <-- LOOK HERE
                //     return;
                // }

                let provider = null;
                if (typeof window.ethereum !== 'undefined') {
                    let providers = window.ethereum.providers;
                    if (providers) {
                        provider = providers.find(p => p.isMetaMask);
                    } else {
                        provider = window.ethereum
                    }
                    try {
                        await provider.request({method: 'eth_requestAccounts'});
                    } catch (error) {
                        throw new Error("User Rejected");
                    }
                } else {
                    throw new Error("No MetaMask Wallet found");
                }
                console.log("MetaMask provider", provider);
                return provider;
            }
        }
    },
    walletLinkOpts: {
        'custom-walletlink': {
            display: {
                logo: '../static/images/coinbase.svg',
                name: 'Coinbase',
                description: 'Scan with WalletLink to connect',
            },
            options: {
                appName: 'IDriss', // Your app name
                rpc: "https://eth-mainnet.alchemyapi.io/v2/NcZapwC9N6OhvtRKvjGhc23st5VmG2hB",
                chainId: 1
            },
            package: CoinbaseWalletProvider,
            connector: async (_, options) => {
                const {appName, networkUrl, chainId} = options
                const walletLink = new WalletLink({
                    appName
                });
                const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
                await provider.enable();
                return provider;
            },
        }
    },
    get providerOptions() {
        return {
            ...this.walletConnectOpts,
            ...this.walletLinkOpts,
            ...this.metaMaskOpts,
            ...this.tallyOpts
        }
    },
    isMetaMaskInstalled() {
        if (window.ethereum?.isMetaMask) {
            return true
        } else {
            return false
        }
    },
    isTallyInstalled() {
        if (window.ethereum?.isTally) {
            return true
        } else {
            return false
        }
    }
}