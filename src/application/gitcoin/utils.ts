import {
  createPublicClient,
  encodeAbiParameters,
  http,
  parseAbiParameters,
} from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

import { EMPTY_HEX, Hex, getRpcUrl } from 'shared/web3';

import {
  OSS_ROUNDS,
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
  DONATION_CONTRACT_ABI,
} from './constants';
import { Application, DonationPayload } from './types';

export const selectTwitterApplications = (applications: Application[]) => {
  const applicationsGroupedByTwitter =
    groupApplicationsByTwitterName(applications);

  const twitterApplications = applicationsGroupedByTwitter
    .map((applications) => {
      return pickApplicationByPriority(applications);
    })
    .filter(Boolean);
  return twitterApplications;
};

// TODO: consider using lodash.groupBy or native Object.groupBy
const groupApplicationsByTwitterName = (applications: Application[]) => {
  const twitterToApplications: Record<string, Application[]> = {};
  for (const application of applications) {
    if (!application.project.metadata.projectTwitter) {
      continue;
    }

    const twitterHandle = application.project.metadata.projectTwitter;
    const alreadyExistingRecord = twitterToApplications[twitterHandle];
    if (alreadyExistingRecord) {
      alreadyExistingRecord.push(application);
    } else {
      twitterToApplications[twitterHandle] = [application];
    }
  }
  return Object.values(twitterToApplications);
};

const pickApplicationByPriority = (applications: Application[]) => {
  const ossApplication = applications.find((application) => {
    return OSS_ROUNDS.includes(application.roundId);
  });

  return ossApplication ?? applications[0];
};

export const getDefaultDonationOptions = (
  application: Application,
): DonationPayload => {
  return {
    amount: 1,
    tokenAddress: '0x0',
    chainId: application.chainId,
  };
};

export const generateVote = (recipientId: Hex, amount: bigint) => {
  const PermitTypeNone = 0; // 0 = native currency transfer
  const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'; // Gitcoin internal address for native
  const nonce = 0; // approval specific, always 0 in our case
  const deadline = 0; // approval specific, always 0 in our case
  const signature =
    '0x0000000000000000000000000000000000000000000000000000000000000000'; // approval specific, always 0x in our case

  const tuple = [
    // Permit2Data
    [
      // ISignatureTransfer.PermitTransferFrom
      [
        // ISignatureTransfer.TokenPermissions
        NATIVE,
        amount, // Amount
      ],
      nonce, // Nonce
      deadline, // Deadline
    ],
    signature, // Signature as an empty byte string
  ];

  return encodeAbiParameters(
    parseAbiParameters(['address', 'uint8', 'tuple']),
    [recipientId, PermitTypeNone, tuple],
  );
};

export const getDonationContractAddress = (chainId: number) => {
  return DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[chainId] ?? EMPTY_HEX;
};

export const getNonce = async (donor: Hex, destinationChainId: number) => {
  const publicClient = createPublicClient({
    transport: http(getRpcUrl(destinationChainId)),
  });
  const nonce = await publicClient.readContract({
    abi: DONATION_CONTRACT_ABI,
    functionName: 'nonces',
    args: [donor],
    address: getDonationContractAddress(destinationChainId),
  });

  return nonce;
};

export const getLoadingMessage = (isCrossChain: boolean) => {
  if (isCrossChain) {
    return 'Sign message and confirm transfer';
  }

  return 'Confirm transfer in your wallet';
};

export const generateAcrossMessage = async (payload: {
  anchorAddress: Hex;
  amount: bigint;
  roundId: number;
  destinationChainId: number;
}) => {
  const privateKey = generatePrivateKey();
  const wallet = privateKeyToAccount(privateKey);
  const vote = generateVote(payload.anchorAddress, payload.amount);
  const nonce = await getNonce(wallet.address, payload.destinationChainId);

  const domain = {
    name: 'IDrissCrossChainDonations',
    version: '1',
  };
  const types = {
    Donation: [
      { name: 'chainId', type: 'uint256' },
      { name: 'roundId', type: 'uint256' },
      { name: 'donor', type: 'address' },
      { name: 'voteParams', type: 'bytes' },
      { name: 'nonce', type: 'uint256' },
      { name: 'validUntil', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
  };

  const data = {
    chainId: payload.destinationChainId,
    roundId: payload.roundId,
    donor: wallet.address,
    voteParams: vote,
    nonce: nonce,
    validUntil: Math.round(Date.now() / 1000) + 3600, // 1 hour
    verifyingContract: getDonationContractAddress(payload.destinationChainId),
  } as const;

  const signature = await wallet.signTypedData({
    domain,
    types,
    primaryType: 'Donation',
    message: data,
  });

  return encodeAbiParameters(
    parseAbiParameters([
      'uint256',
      'uint256',
      'address',
      'bytes',
      'uint256',
      'uint256',
      'address',
      'bytes',
    ]),
    [
      BigInt(data.chainId),
      BigInt(data.roundId),
      data.donor,
      data.voteParams,
      BigInt(data.nonce),
      BigInt(data.validUntil),
      data.verifyingContract,
      signature,
    ],
  );
};
