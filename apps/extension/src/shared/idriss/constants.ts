import { createLookup } from 'shared/utils';

import { IdrissIdentifierType } from './types';

export const GET_MULTIPLE_IDRISS_REGISTRY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_idrissRegistryAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_idrissReverseRegistryAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'hashes',
        type: 'string[]',
      },
    ],
    name: 'getMultipleIDriss',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: '_hash',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'result',
            type: 'string',
          },
        ],
        internalType: 'struct IDrissWrapperContract.IDrissResult[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
    ],
    name: 'getMultipleReverse',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: '_address',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'result',
            type: 'string',
          },
        ],
        internalType: 'struct IDrissWrapperContract.IDrissReverseResult[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registry',
    outputs: [
      {
        internalType: 'contract IIDrissRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reverseRegistry',
    outputs: [
      {
        internalType: 'contract IReverseRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const WIDGET_WIDTH = 256;

export const PHONE_REGEXP =
  /^(\+\(?\d{1,4}\s?)\)?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
export const EMAIL_REGEXP = /^[\w.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}/;
export const TWITTER_REGEXP = /^@\w{1,15}$/;

const IDRISS_IDENTIFIER_TYPES: IdrissIdentifierType[] = [
  'EMAIL',
  'PHONE',
  'TWITTER',
  'UNKNOWN',
];
export const IDRISS_IDENTIFIER_TYPE = createLookup(IDRISS_IDENTIFIER_TYPES);
