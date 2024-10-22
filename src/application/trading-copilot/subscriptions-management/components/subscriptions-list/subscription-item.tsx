import { useCallback } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { Icon, IconButton, LazyImage, getGithubUserLink } from 'shared/ui';
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
          className="size-5 rounded-full"
          fallbackComponent={
            <Icon size={20} name="PersonIcon" className="rounded-full" />
          }
        />

        <p className="ml-2 flex items-center gap-1 text-sm text-gray-700">
          {subscription.ensName}

          {twitterQuery.data && (
            <a
              href={getTwitterUserLink(twitterQuery.data)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon
                size={16}
                name="TwitterLogoIcon"
                className="text-twitter-primary [&>path]:fill-rule-non-zero"
              />
            </a>
          )}
          {githubQuery.data && (
            <a
              href={getGithubUserLink(githubQuery.data)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon
                size={16}
                name="GitHubLogoIcon"
                className="text-twitter-primary"
              />
            </a>
          )}
          {discordQuery.data && (
            <span title={discordQuery.data}>
              <Icon
                size={16}
                name="DiscordLogoIcon"
                className="text-twitter-primary"
              />
            </span>
          )}
          {emailQuery.data && (
            <a
              href={`mailto:${emailQuery.data}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon
                size={16}
                name="EnvelopeClosedIcon"
                className="text-twitter-primary"
              />
            </a>
          )}
        </p>
      </div>
      <IconButton
        iconProps={{ name: 'Cross1Icon' }}
        className="text-red-700"
        onClick={remove}
      />
    </li>
  );
};
