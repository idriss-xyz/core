import { useCallback } from 'react';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { useCommandQuery } from 'shared/messaging';
import { Icon, LazyImage, getGithubUserLink } from 'shared/ui';
import { getTwitterUserLink } from 'host/twitter';

import { GetEnsInfoCommand } from '../../../commands';
import { Subscription } from '../../../types';

type Properties = {
  subscription: Subscription;
  onRemove: (ensName: Subscription['ensName']) => void;
};

export const SubscriptionItem = ({ subscription, onRemove }: Properties) => {
  const remove = useCallback(() => {
    onRemove(subscription.ensName);
  }, [onRemove, subscription]);

  const emailQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: subscription.ensName,
      infoKey: 'email',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const twitterQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: subscription.ensName,
      infoKey: 'com.twitter',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const githubQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: subscription.ensName,
      infoKey: 'com.github',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const discordQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: subscription.ensName,
      infoKey: 'com.discord',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: subscription.ensName,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center">
        <LazyImage
          src={avatarQuery.data}
          className="size-8 rounded-full border border-neutral-400 bg-neutral-200"
          fallbackComponent={
            <div className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
              <IdrissIcon
                size={20}
                name="CircleUserRound"
                className="text-neutral-500"
              />
            </div>
          }
        />

        <p className="ml-1.5 flex items-center gap-1.5 text-label5 text-neutral-600">
          {subscription.ensName}

          {twitterQuery.data && (
            <ExternalLink href={getTwitterUserLink(twitterQuery.data)}>
              <Icon
                size={16}
                name="TwitterLogoIcon"
                className="text-[#757575] [&>path]:fill-rule-non-zero"
              />
            </ExternalLink>
          )}
          {githubQuery.data && (
            <ExternalLink href={getGithubUserLink(githubQuery.data)}>
              <Icon
                size={16}
                name="GitHubLogoIcon"
                className="text-[#757575]"
              />
            </ExternalLink>
          )}
          {discordQuery.data && (
            <span title={discordQuery.data}>
              <Icon
                size={16}
                name="DiscordLogoIcon"
                className="text-[#757575]"
              />
            </span>
          )}
          {emailQuery.data && (
            <ExternalLink href={`mailto:${emailQuery.data}`}>
              <Icon
                size={16}
                name="EnvelopeClosedIcon"
                className="text-[#757575]"
              />
            </ExternalLink>
          )}
        </p>
      </div>
      <IconButton
        intent="tertiary"
        size="small"
        iconName="Trash2"
        onClick={remove}
        className="text-red-500"
      />
    </li>
  );
};
