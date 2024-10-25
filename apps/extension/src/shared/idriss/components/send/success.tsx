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
      <Icon
        name="CheckCircledIcon"
        className="text-idriss-primary-500"
        size={124}
      />
      <p className="mt-4 text-lg font-medium leading-6 text-gray-900">
        Transaction Submitted 🥳
      </p>
      <a
        href={transactionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex items-center space-x-1"
      >
        <span className="text-base font-normal leading-6 text-gray-500">
          View on Explorer
        </span>
        <Icon name="ExternalLinkIcon" size={16} className="text-gray-500" />
      </a>
      <Button
        onClick={onConfirm}
        className="mt-5 w-full rounded-md bg-idriss-primary-500 py-2 text-base font-medium text-white shadow-sm hover:bg-idriss-primary-400"
      >
        Close
      </Button>
    </div>
  );
};
