import { config as dotenv } from 'dotenv';
import { createConfig } from 'ponder';
import {
  TIPPING_ABI,
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
} from '@idriss-xyz/constants';
import { fallback, http } from 'viem';

dotenv({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

export default createConfig({
  chains: {
    ethereum: {
      id: 1,
      pollingInterval: 5000,
      rpc: fallback([
        http('https://eth.drpc.org'),
        http(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`),
        http(
          `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        ),
      ]),
    },
    base: {
      id: 8453,
      pollingInterval: 3000,
      rpc: fallback([
        http('https://mainnet.base.org'),

        http(`https://base-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`),
        http(
          `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        ),
        http('https://base.llamarpc.com'),
      ]),
    },
    ronin: {
      id: 2020,
      pollingInterval: 3000,
      rpc: fallback([
        http('https://ronin.drpc.org'),
        http(
          `https://ronin-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        ),
      ]),
    },
    abstract: {
      id: 2741,
      pollingInterval: 3000,
      rpc: fallback([
        http('https://api.mainnet.abs.xyz'),
        http(
          `https://abstract-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        ),
      ]),
    },
    avalanche: {
      id: 43114,
      pollingInterval: 3000,
      rpc: fallback([
        http('https://api.avax.network/ext/bc/C/rpc'),
        http(
          `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        ),
        http(
          `https://avax-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        ),
      ]),
    },
  },
  contracts: {
    idrissTippingEthereum: {
      chain: 'ethereum',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[1],
      startBlock: 23852207,
    },
    idrissTippingBase: {
      chain: 'base',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[8453],
      startBlock: 38498477,
    },
    idrissTippingRonin: {
      chain: 'ronin',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[2020],
      startBlock: 50641363,
    },
    idrissTippingAbstract: {
      chain: 'abstract',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[2741],
      startBlock: 26650497,
    },
    idrissTippingAvalanche: {
      chain: 'avalanche',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[43114],
      startBlock: 72371779,
    },
  },
  database:
    process.env.NODE_ENV === 'production'
      ? {
          kind: 'postgres',
          connectionString: process.env.DATABASE_URL!,
        }
      : {
          kind: 'postgres',
          connectionString: process.env.DATABASE_URL!,
        },
});
