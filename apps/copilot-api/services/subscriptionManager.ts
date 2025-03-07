import { dataSource } from '../db';
import { WebhookEntity } from '../entities/webhook.entity';
import { SubscribersEntity } from '../entities/subscribers.entity';
import { AddressesEntity } from '../entities/addreesses.entity';
import { SubscriptionsEntity } from '../entities/subscribtions.entity';
import { AddressWebhookMapEntity } from '../entities/addressWebhookMap.entity';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { join } from 'path';
import { WEBHOOK_NETWORK_TYPES, WEBHOOK_NETWORKS } from '../constants';
import { mode } from '../utils/mode';
import { isAddress } from 'viem';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

const ALCHEMY_API_BASE_URL = 'https://dashboard.alchemyapi.io';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
const HELIUS_API_BASE_URL = 'https://api.helius.xyz';
const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const WEBHOOK_URL = process.env.WEBHOOK_URL!;
const MAX_ADDRESSES_PER_WEBHOOK =
  Number(process.env.MAX_ADDRESSES_PER_WEBHOOK) || 100;

const subscribersRepo = dataSource.getRepository(SubscribersEntity);
const addressRepo = dataSource.getRepository(AddressesEntity);
const subscriptionsRepo = dataSource.getRepository(SubscriptionsEntity);
const addressMapWebhooksRepo = dataSource.getRepository(
  AddressWebhookMapEntity,
);
const webhooksRepo = dataSource.getRepository(WebhookEntity);

export const subscribeAddress = async (
  subscriber_id: string,
  address: string,
  chainType: WEBHOOK_NETWORK_TYPES,
  fid?: number,
) => {
  if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
    address = address.toLowerCase();
  }

  await addressRepo.save({ address });
  await subscriptionsRepo.save({
    subscriber_id,
    address,
    fid,
  });

  const addressWebhookMap = await addressMapWebhooksRepo.findOne({
    where: { address },
  });
  if (!addressWebhookMap) {
    await addAddressToWebhook(address, chainType);
  }
};

export const unsubscribeAddress = async (
  subscriberId: string,
  address: string,
  chainType: WEBHOOK_NETWORK_TYPES,
): Promise<void> => {
  if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
    address = address.toLowerCase();
  }
  try {
    await subscriptionsRepo.delete({ subscriber_id: subscriberId, address });

    // Check if the subscriber has any other subscriptions
    const subscriberRes = await subscriptionsRepo.count({
      where: { subscriber_id: subscriberId },
    });

    if (parseInt(subscriberRes.toString(), 10) === 0) {
      // Subscriber has no more subscriptions, remove from subscribers table
      await subscribersRepo.delete({ subscriber_id: subscriberId });
    }

    // Check if the address has any other subscribers
    const addressRes = await subscriptionsRepo.count({ where: { address } });

    if (parseInt(addressRes.toString(), 10) === 0) {
      // No more subscribers, remove address from webhook and addresses table
      await removeAddressFromWebhook(address, chainType);

      // Remove address from addresses table
      await addressRepo.delete({ address });
    }
  } catch (error) {
    console.error('Error unsubscribing address:', error);
    throw error;
  }
};

const saveWebhookToDb = async (
  address: string,
  webhook: {
    webhookId: any;
    internalWebhookId: string;
    chainType: string;
    signingKey: string;
  } | null,
) => {
  if (webhook == null) return;
  const { webhookId, internalWebhookId, chainType, signingKey } = webhook;
  await webhooksRepo.save({
    internal_id: internalWebhookId,
    webhook_id: webhookId,
    chainType: chainType,
    signing_key: signingKey,
  });
  await addressMapWebhooksRepo.save({
    address,
    webhook_internal_id: internalWebhookId,
  });
};

const addAddressToWebhook = async (address: string, chainType: string) => {
  const res = await webhooksRepo
    .createQueryBuilder('webhooks')
    .select(['webhooks.internal_id', 'webhooks.webhook_id'])
    .where('webhooks.chainType = :chainType', { chainType })
    .andWhere((qb) => {
      const subQuery = qb
        .subQuery()
        .select('address_webhook_map.webhook_internal_id')
        .from(AddressWebhookMapEntity, 'address_webhook_map')
        .groupBy('address_webhook_map.webhook_internal_id')
        .having('COUNT(address_webhook_map.address) < :maxCount', {
          maxCount: MAX_ADDRESSES_PER_WEBHOOK,
        })
        .getQuery();
      return `webhooks.internal_id IN (${subQuery})`;
    })
    .limit(1)
    .getRawOne();

  if (!res) {
    if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
      const webhooks = await createNewWebhook(address);
      for (const webhook of webhooks) {
        await saveWebhookToDb(address, webhook);
      }
    } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
      const webhook = await createNewSolanaWebhook(address);
      await saveWebhookToDb(address, webhook);
    }
  } else {
    const {
      webhooks_webhook_id: webhook_id,
      webhooks_internal_id: internal_id,
    } = res;
    if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
      await updateWebhookAddresses(webhook_id, [address], []);
    } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
      await updateSolanaWebhookAddresses(webhook_id, [address], []);
    }
    await addressMapWebhooksRepo.save({
      address,
      webhook_internal_id: internal_id,
    });
  }
};

async function removeAddressFromWebhook(
  address: string,
  chainType: WEBHOOK_NETWORK_TYPES,
): Promise<void> {
  // Get the webhook associated with the address
  const res = await addressMapWebhooksRepo.findOne({ where: { address } });

  if (!res) {
    // Address is not associated with any webhook
    return;
  }

  const { webhook_internal_id } = res;

  // Get webhook ID and signing key
  const webhookData = await webhooksRepo.findOne({
    where: { internal_id: webhook_internal_id },
  });

  if (!webhookData) {
    // Webhook does not exist
    return;
  }

  const { webhook_id } = webhookData;

  // Update the webhook via webhook proovider API
  if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
    await updateWebhookAddresses(webhook_id, [], [address]);
  } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
    await updateSolanaWebhookAddresses(webhook_id, [], [address]);
  }

  // Remove address from address_webhook_map
  await addressMapWebhooksRepo.delete({ address });

  // Check if webhook has any other addresses
  const countRes = await addressMapWebhooksRepo.count({
    where: { webhook_internal_id },
  });

  if (parseInt(countRes.toString(), 10) === 0) {
    // Delete webhook from webhook provider and database
    if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
      await deleteAlchemyWebhook(webhook_id);
    } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
      await deleteHeliusWebhook(webhook_id);
    }

    await webhooksRepo.delete({ internal_id: webhook_internal_id });
  }
}

const createNewWebhook = async (address: string) => {
  try {
    const webhooks = [];
    for (const NETWORK of WEBHOOK_NETWORKS) {
      const internalWebhookId = uuidv4();
      const webhookUrl = `${WEBHOOK_URL}/webhook/${internalWebhookId}`;

      const response = await axios.post(
        `${ALCHEMY_API_BASE_URL}/api/create-webhook`,
        {
          webhook_url: webhookUrl,
          network: NETWORK,
          webhook_type: 'ADDRESS_ACTIVITY',
          addresses: [address],
        },
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-Alchemy-Token': ALCHEMY_API_KEY,
          },
        },
      );

      const data = response.data;

      const webhookId = data.data.id;
      const signingKey = data.data.signing_key;

      webhooks.push({
        webhookId,
        internalWebhookId,
        chainType: 'EVM',
        signingKey,
      });
    }
    return webhooks;
  } catch (err) {
    console.error('Error creating webhook: ', err);
    return [];
  }
};

const createNewSolanaWebhook = async (address: string) => {
  try {
    const internalWebhookId = uuidv4();
    const webhookSecret = uuidv4();
    const webhookUrl = `${WEBHOOK_URL}/webhook/solana/${internalWebhookId}`;
    console.log("Creating webhook for address: ", address);
    console.log("Secret is: ", webhookSecret);

    const response = await axios.post(
      `${HELIUS_API_BASE_URL}/v0/webhooks?api-key=${HELIUS_API_KEY}`,
      {
        webhookURL: webhookUrl,
        transactionTypes: ['SWAP', 'UNKNOWN'],
        accountAddresses: [address],
        webhookType: 'enhanced',
        authHeader: webhookSecret,
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      },
    );

    console.log("Response from webhook creation: ", response.data);

    const webhookId = response.data.webhookID;

    return {
      webhookId,
      internalWebhookId,
      chainType: 'SOLANA',
      signingKey: webhookSecret,
    };
  } catch (err) {
    console.error('Error creating Solana webhook: ', err);
    return null;
  }
};

const updateWebhookAddresses = async (
  webhookId: string,
  addressesToAdd: string[],
  addressesToRemove: string[],
): Promise<void> => {
  try {
    await axios.patch(
      `${ALCHEMY_API_BASE_URL}/api/update-webhook-addresses`,
      {
        webhook_id: webhookId,
        addresses_to_add: addressesToAdd,
        addresses_to_remove: addressesToRemove,
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'X-Alchemy-Token': ALCHEMY_API_KEY,
        },
      },
    );
  } catch (err) {
    console.error('Error updating webhook: ', err);
  }
};

const updateSolanaWebhookAddresses = async (
  webhookId: string,
  addressesToAdd: string[],
  addressesToRemove: string[],
): Promise<void> => {
  try {
    const webhookData = await fetchHeliusWebhookData(webhookId);

    if (!webhookData) {
      return;
    }

    const previousAddresses = webhookData.accountAddresses;
    const filteredAddresses = previousAddresses.filter(
      (address: string) => !addressesToRemove.includes(address),
    );

    const newAddresses = [...filteredAddresses, ...addressesToAdd];

    if (newAddresses.length === 0) {
      // If no addresses left, do not edit and continue to deletion
      return;
    }

    await axios.put(
      `${HELIUS_API_BASE_URL}/v0/webhooks/${webhookId}?api-key=${HELIUS_API_KEY}`,
      {
        webhookURL: webhookData.webhookURL,
        transactionTypes: webhookData.transactionTypes,
        webhookType: webhookData.webhookType,
        accountAddresses: newAddresses,
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      },
    );
  } catch (err) {
    console.error('Error updating Solana webhook: ', err);
  }
};

const fetchHeliusWebhookData = async (webhookId: string) => {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks/${webhookId}?api-key=${HELIUS_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = response.json();
    return data;
  } catch (err) {
    console.error('Error fetching current Solana webhook: ', err);
    return null;
  }
};

async function deleteAlchemyWebhook(webhookId: string): Promise<void> {
  try {
    await axios.delete(
      `${ALCHEMY_API_BASE_URL}/api/delete-webhook?webhook_id=${webhookId}`,
      {
        headers: {
          'accept': 'application/json',
          'X-Alchemy-Token': ALCHEMY_API_KEY,
        },
      },
    );
    return;
  } catch (err) {
    console.error('Error deleting webhook: ', err);
  }
}

async function deleteHeliusWebhook(webhookId: string): Promise<void> {
  try {
    await axios.delete(
      `${HELIUS_API_BASE_URL}/v0/webhooks/${webhookId}?api-key=${HELIUS_API_KEY}`,
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      },
    );
    return;
  } catch (err) {
    console.error('Error deleting webhook: ', err);
  }
}

export const getSubscriptionsDetails = async (
  subscriberId: string,
): Promise<{ address: string; fid: number | null }[]> => {
  const res = await subscriptionsRepo.find({
    where: { subscriber_id: subscriberId },
  });
  return res.map((subscription: SubscriptionsEntity) => ({
    address: subscription.address,
    fid: subscription.fid,
  }));
};

export const isSubscribedAddress = async (
  address: string,
  chainType: WEBHOOK_NETWORK_TYPES,
): Promise<boolean> => {
  if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
    address = address.toLowerCase();
  }
  const res = await subscriptionsRepo.count({ where: { address } });
  return parseInt(res.toString(), 10) > 0;
};

export const getSubscribersByAddress = async (
  address: string,
): Promise<string[]> => {
  if (isAddress(address)) {
    address = address.toLowerCase();
  }
  const res = await subscriptionsRepo.find({ where: { address } });
  return res.map(
    (subscription: SubscriptionsEntity) => subscription.subscriber_id,
  );
};

export const getSigningKey = async (
  internalWebhookId: string,
): Promise<string | undefined> => {
  const res = await webhooksRepo.find({
    where: { internal_id: internalWebhookId },
  });
  return res.length > 0 ? res[0].signing_key : undefined;
};
