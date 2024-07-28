import { ethers } from 'ethers';

import { OSS_ROUNDS } from './constants';
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

export const generateVote = (recipientId: string, amount: number) => {
  const PermitTypeNone = 0; // 0 = native currency transfer
  const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'; // Gitcoin internal address for native
  const nonce = 0; // approval specific, always 0 in our case
  const deadline = 0; // approval specific, always 0 in our case
  const signature =
    '0x0000000000000000000000000000000000000000000000000000000000000000'; // approval specific, always 0x in our case
  const types = [
    'address',
    'uint8',
    'tuple(tuple(tuple(address, uint256), uint256, uint256), bytes)',
  ];
  const data = [
    recipientId,
    PermitTypeNone, // PermitType.None as 0
    [
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
    ],
  ];
  const abiCoder = ethers.utils.defaultAbiCoder;
  return abiCoder.encode(types, data);
};

export const generateDonationData = (
  roundId: number,
  senderAddress: string,
  voteParameters: string,
) => {
  const abiCoder = ethers.utils.defaultAbiCoder;
  return abiCoder.encode(
    ['uint256', 'address', 'bytes'],
    [roundId, senderAddress, voteParameters],
  );
};

export const generateCombinedMessage = (message: string, signature: string) => {
  const abiCoder = ethers.utils.defaultAbiCoder;
  return abiCoder.encode(['bytes', 'bytes'], [message, signature]);
};

export const getLoadingMessage = (isCrossChain: boolean) => {
  if (isCrossChain) {
    return 'Sign message and confirm transfer';
  }

  return 'Confirm transfer in your wallet';
};
