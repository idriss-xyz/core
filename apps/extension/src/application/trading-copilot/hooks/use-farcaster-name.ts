
import { useCommandQuery } from 'shared/messaging';
import { useEffect, useState } from 'react';
import { SubscriptionsStorage } from 'shared/web3/storage';
import { GetFarcasterUserCommand } from 'application/trading-copilot/commands';


export const useFarcasterName = (address: string) => {
  const [fid, setFid] = useState();
  let userName = address;
  const farcasterUserQuery = useCommandQuery({
    command: new GetFarcasterUserCommand({
      id: fid ?? 0,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: fid !== undefined,
  });

  if (farcasterUserQuery.data?.user) {
    userName = farcasterUserQuery.data?.user.displayName;
  }

  useEffect(() => {
    const getFarcasterName = async () => {
      const subscriptions = await SubscriptionsStorage.get();
      const matchingSubscription = subscriptions?.find(sub => sub.address === address);

      setFid(matchingSubscription?.fid)
    };

    getFarcasterName();
  }, []);

  return userName;
};