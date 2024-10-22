import { SUBSCRIPTIONS_STORAGE_KEY } from './constants';
import { Subscription } from './types';

export const TradingCopilotSettingsManager = {
  getAllSubscriptions(): Promise<Subscription[]> {
    return chrome.storage.local
      .get(SUBSCRIPTIONS_STORAGE_KEY)
      .then((result) => {
        return (result[SUBSCRIPTIONS_STORAGE_KEY] as Subscription[]) ?? [];
      });
  },

  async subscribe(subscription: Subscription): Promise<void> {
    const allSubscriptions = await this.getAllSubscriptions();

    if (
      allSubscriptions.some((existingSubscription) => {
        return existingSubscription.ensName === subscription.ensName;
      })
    ) {
      throw new Error('User already subscribed');
    }

    return chrome.storage.local.set({
      [SUBSCRIPTIONS_STORAGE_KEY]: [...allSubscriptions, subscription],
    });
  },

  async unsubscribe(ensName: Subscription['ensName']): Promise<void> {
    const allSubscriptions = await this.getAllSubscriptions();

    return chrome.storage.local.set({
      [SUBSCRIPTIONS_STORAGE_KEY]: allSubscriptions.filter(
        (existingSubscription) => {
          return existingSubscription.ensName !== ensName;
        },
      ),
    });
  },
};
