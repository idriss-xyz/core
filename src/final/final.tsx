import { useMemo } from 'react';

import { GetServiceStatusCommand } from 'shared/extension';
import { useCommandQuery } from 'shared/messaging';
import { GitcoinDonationWidget } from 'application/gitcoin';
import { IdrissSendWidget } from 'application/idriss-send';

import { useRecipients } from './hooks';

export const Final = () => {
  const serviceStatusQuery = useCommandQuery({
    staleTime: Number.POSITIVE_INFINITY,
    command: new GetServiceStatusCommand({}),
  });

  const applicationsStatus = useMemo(() => {
    return {
      gitcoin: Boolean(serviceStatusQuery.data?.gitcoin),
      idrissSend: Boolean(serviceStatusQuery.data?.['idriss-send']),
    };
  }, [serviceStatusQuery.data]);

  const { recipients } = useRecipients({
    idrissSendEnabled: applicationsStatus.idrissSend,
    gitcoinEnabled: applicationsStatus.gitcoin,
  });

  return (
    <>
      {recipients.map((recipient) => {
        const key = `${recipient.username}-${recipient.top}`;
        if (recipient.type === 'gitcoin') {
          return <GitcoinDonationWidget key={key} recipient={recipient} />;
        }

        return <IdrissSendWidget key={key} recipient={recipient} />;
      })}
    </>
  );
};
