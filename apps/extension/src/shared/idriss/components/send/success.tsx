import { ExternalLink } from '@idriss-xyz/ui/external-link';

import { Button, Icon } from 'shared/ui';
import { getTransactionUrl, Hex } from 'shared/web3';

interface Properties {
  chainId: number;
  transactionHash: Hex;
  onConfirm: () => void;
}

export const Success = ({
  chainId,
  transactionHash,
  onConfirm,
}: Properties) => {
  const transactionUrl = getTransactionUrl({ chainId, transactionHash });
  return (
    <div className="flex flex-col items-center text-center">
      <Icon name="CheckCircledIcon" className="text-[#11DD74]" size={124} />
      <p className="mt-4 text-lg font-medium leading-6 text-[#111827]">
        Transaction Submitted 🥳
      </p>
      <ExternalLink
        href={transactionUrl}
        className="mt-1 flex items-center space-x-1"
      >
        <span className="text-base font-normal leading-6 text-[#64748B]">
          View on Explorer
        </span>
        <Icon name="ExternalLinkIcon" size={16} className="text-[#64748B]" />
      </ExternalLink>
      <Button
        onClick={onConfirm}
        className="mt-5 w-full rounded-md bg-[#11DD74] py-2 text-base font-medium text-white shadow-sm hover:bg-[#11DD74]"
      >
        Close
      </Button>
    </div>
  );
};
