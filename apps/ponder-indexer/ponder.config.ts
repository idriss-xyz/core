import { config as dotenv } from 'dotenv';
import { createConfig } from 'ponder';
import {
  TIPPING_ABI,
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
} from '@idriss-xyz/constants';

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
      rpc: [
        `https://eth.drpc.org`,
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      ],
    },
    base: {
      id: 8453,
      rpc: [
        `https://1rpc.io/base`,
        `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      ],
    },
    ronin: {
      id: 2020,
      rpc: [
        `https://ronin.drpc.org`,
        `https://ronin-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      ],
    },
    abstract: {
      id: 2741,
      rpc: [
        `https://api.mainnet.abs.xyz`,
        `https://abstract-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      ],
    },
    avalanche: {
      id: 43114,
      rpc: [
        `https://api.avax.network/ext/bc/C/rpc`,
        `https://avax-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      ],
    },
  },
  contracts: {
    idrissTippingEthereum: {
      chain: 'ethereum',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[1],
      startBlock: 23627193,
    },
    idrissTippingBase: {
      chain: 'base',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[8453],
      startBlock: 37138067,
    },
    idrissTippingRonin: {
      chain: 'ronin',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[2020],
      startBlock: 49734153,
    },
    idrissTippingAbstract: {
      chain: 'abstract',
      abi: TIPPING_ABI,
      address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[2741],
      startBlock: 21684578,
    },
    idrissTippingAvalanche: {
      chain: 'avalanche',
      abi: TIPPING_ABI,
      // address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[43114],
      address: '0xBDc14c9946A957C7038900dE19Fb2Aa3f72CFAc2',
      startBlock: 70683678,
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
