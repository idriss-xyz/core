import { useMemo } from 'react';

import { useGitcoinDonationRecipients } from 'application/gitcoin';
import { useIdrissSendRecipients } from 'application/idriss-send';
import { useTwitterScraping } from 'host/twitter';

import { Recipient } from '../types';

interface Properties {
  gitcoinEnabled: boolean;
  idrissSendEnabled: boolean;
}

export const useRecipients = ({
  gitcoinEnabled,
  idrissSendEnabled,
}: Properties) => {
  const { users } = useTwitterScraping();
  const { recipients: idrissSendRecipients } = useIdrissSendRecipients({
    users,
    enabled: idrissSendEnabled,
  });

  const { recipients: gitcoinDonationRecipients } =
    useGitcoinDonationRecipients({ users, enabled: gitcoinEnabled });

  const recipients: Recipient[] = useMemo(() => {
    if (!gitcoinEnabled && !idrissSendEnabled) {
      return [];
    }

    if (!gitcoinEnabled) {
      return idrissSendRecipients.map((recipient) => {
        return { ...recipient, type: 'idrissSend' };
      });
    }

    if (!idrissSendRecipients) {
      return gitcoinDonationRecipients.map((recipient) => {
        return { ...recipient, type: 'gitcoin' } as const;
      });
    }

    const idrissSendUsernames = idrissSendRecipients.map((recipient) => {
      return recipient.username;
    });

    const gitcoinDonationUsernames = gitcoinDonationRecipients.map(
      (recipient) => {
        return recipient.username;
      },
    );

    const uniqueUsernames = [
      ...new Set([...idrissSendUsernames, ...gitcoinDonationUsernames]),
    ];

    const recipients = uniqueUsernames.flatMap<Recipient>((username) => {
      const gitcoinRecipientsForThisUsername = gitcoinDonationRecipients.filter(
        (recipient) => {
          return recipient.username === username;
        },
      );

      if (gitcoinRecipientsForThisUsername.length > 0) {
        return gitcoinRecipientsForThisUsername.map((recipient) => {
          return { ...recipient, type: 'gitcoin' as const };
        });
      }

      const idrissRecipientsForThisUsername = idrissSendRecipients.filter(
        (recipient) => {
          return recipient.username === username;
        },
      );

      return idrissRecipientsForThisUsername.map((recipient) => {
        return { ...recipient, type: 'idrissSend' as const };
      });
    });

    return recipients;
  }, [
    gitcoinDonationRecipients,
    gitcoinEnabled,
    idrissSendEnabled,
    idrissSendRecipients,
  ]);

  return { recipients };
};
