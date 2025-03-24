import { dataSource } from '../db';
import { WebhookEntity } from '../entities/webhook.entity';
import { AddressesEntity } from '../entities/addresses.entity';
import { SubscriptionsEntity } from '../entities/subscribtions.entity';
import { AddressWebhookMapEntity } from '../entities/addressWebhookMap.entity';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { join } from 'path';
import {
  WEBHOOK_NETWORKS,
  MAX_ADDRESSES_PER_WEBHOOK,
  WEBHOOK_NETWORK_TYPES,
} from '../constants';
import { mode } from '../utils/mode';
import { SubscriptionsDetailsInterface, WebhookDataInterface } from '../types';
import { isAddress } from 'viem';
import { throwExternalError } from '../middleware/error.middleware';
import { EntityManager } from 'typeorm';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

const ALCHEMY_API_BASE_URL = 'https://dashboard.alchemyapi.io';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
const HELIUS_API_BASE_URL = 'https://api.helius.xyz';
const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const WEBHOOK_URL = process.env.WEBHOOK_URL!;

const subscriptionsRepo = dataSource.getRepository(SubscriptionsEntity);
const webhooksRepo = dataSource.getRepository(WebhookEntity);

export const subscribeAddress = async (
  subscriber_id: string,
  address: string,
  fid?: number,
) => {
  if (isAddress(address)) {
    address = address.toLowerCase();
  }

  await dataSource.transaction(async (transaction) => {
    await transaction.save(AddressesEntity, { address });
    await transaction.save(SubscriptionsEntity, {
      subscriber_id,
      address,
      fid,
    });

    const addressWebhookMap = await transaction.findOne(
      AddressWebhookMapEntity,
      {
        where: { address },
      },
    );
    if (!addressWebhookMap) {
      await addAddressToWebhook(address, transaction);
    }
  });
};

export const unsubscribeAddress = async (
  subscriberId: string,
  address: string,
): Promise<void> => {
  if (isAddress(address)) {
    address = address.toLowerCase();
  }
  await dataSource.transaction(async (transaction) => {
    await transaction.delete(SubscriptionsEntity, {
      subscriber_id: subscriberId,
      address,
    });

    // Check if the address has any other subscribers
    const addressRes = await transaction.count(SubscriptionsEntity, {
      where: { address },
    });

    if (parseInt(addressRes.toString(), 10) === 0) {
      // No more subscribers, remove address from webhook and addresses table
      await removeAddressFromWebhook(address, transaction);

      // Remove address from addresses table
      await transaction.delete(AddressesEntity, { address });
    }
  });
};

const saveWebhookToDb = async (
  address: string,
  webhook: {
    webhookId: any;
    internalWebhookId: string;
    chainType: string;
    signingKey: string;
  } | null,
  transaction: EntityManager,
) => {
  if (webhook == null) return;
  const { webhookId, internalWebhookId, chainType, signingKey } = webhook;
  await transaction.save(WebhookEntity, {
    internal_id: internalWebhookId,
    webhook_id: webhookId,
    chainType: chainType,
    signing_key: signingKey,
  });
  await transaction.save(AddressesEntity, {
    address,
    webhook_internal_id: internalWebhookId,
  });
};

const addAddressToWebhook = async (
  address: string,
  transaction: EntityManager,
) => {
  const chainType = isAddress(address)
    ? WEBHOOK_NETWORK_TYPES.EVM
    : WEBHOOK_NETWORK_TYPES.SOLANA;
  const res = await webhooksRepo
    .createQueryBuilder('webhooks')
    .select([
      'webhooks.internal_id',
      'webhooks.webhook_id',
      'webhooks.signing_key',
    ])
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
        await saveWebhookToDb(address, webhook, transaction);
      }
    } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
      const webhook = await createNewSolanaWebhook(address);
      await saveWebhookToDb(address, webhook, transaction);
    }
  } else {
    const {
      webhooks_webhook_id: webhook_id,
      webhooks_internal_id: internal_id,
      webhooks_signing_key: signingKey,
    } = res;
    if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
      await updateWebhookAddresses(webhook_id, [address], []);
    } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
      await updateSolanaWebhookAddresses(webhook_id, signingKey, [address], []);
    }
    await transaction.save(AddressWebhookMapEntity, {
      address,
      webhook_internal_id: internal_id,
    });
  }
};

async function removeAddressFromWebhook(
  address: string,
  transaction: EntityManager,
): Promise<void> {
  // Get the webhook associated with the address
  const res = await transaction.findOne(AddressWebhookMapEntity, {
    where: { address },
  });

  if (!res) {
    // Address is not associated with any webhook
    return;
  }

  const { webhook_internal_id } = res;

  // Get webhook ID and signing key
  const webhookData = await transaction.findOne(WebhookEntity, {
    where: { internal_id: webhook_internal_id },
  });

  if (!webhookData) {
    // Webhook does not exist
    return;
  }

  const { webhook_id, signing_key } = webhookData;

  const chainType = isAddress(address)
    ? WEBHOOK_NETWORK_TYPES.EVM
    : WEBHOOK_NETWORK_TYPES.SOLANA;

  // Update the webhook via webhook proovider API
  if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
    await updateWebhookAddresses(webhook_id, [], [address]);
  } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
    await updateSolanaWebhookAddresses(webhook_id, signing_key, [], [address]);
  }

  // Remove address from address_webhook_map
  await transaction.delete(AddressWebhookMapEntity, { address });

  // Check if webhook has any other addresses
  const countRes = await transaction.count(AddressWebhookMapEntity, {
    where: { webhook_internal_id },
  });

  if (parseInt(countRes.toString(), 10) === 0) {
    // Delete webhook from webhook provider and database
    if (chainType === WEBHOOK_NETWORK_TYPES.EVM) {
      await deleteAlchemyWebhook(webhook_id);
    } else if (chainType === WEBHOOK_NETWORK_TYPES.SOLANA) {
      await deleteHeliusWebhook(webhook_id);
    }

    await transaction.delete(WebhookEntity, {
      internal_id: webhook_internal_id,
    });
  }
}

const createNewWebhook = async (
  address: string,
): Promise<WebhookDataInterface[]> => {
  try {
    const webhooks: WebhookDataInterface[] = [];
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

      if (response.status !== 200) {
        throwExternalError(response, 'Could not create webhook');
      }

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
    throw new Error(`Error creating webhook: ${err}`);
  }
};

const createNewSolanaWebhook = async (address: string) => {
  try {
    const internalWebhookId = uuidv4();
    const webhookSecret = uuidv4();
    const webhookUrl = `${WEBHOOK_URL}/webhook/solana/${internalWebhookId}`;

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

    if (response.status !== 200) {
      throwExternalError(response, 'Could not create Solana webhook');
    }

    const webhookId = response.data.webhookID;

    return {
      webhookId,
      internalWebhookId,
      chainType: WEBHOOK_NETWORK_TYPES.SOLANA,
      signingKey: webhookSecret,
    };
  } catch (err) {
    throw new Error(`Error creating Solana webhook: ${err}`);
  }
};

const updateWebhookAddresses = async (
  webhookId: string,
  addressesToAdd: string[],
  addressesToRemove: string[],
): Promise<void> => {
  const response = await axios.patch(
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

  if (response.status !== 200) {
    throwExternalError(response, 'Error updating webhook addresses');
  }
};

const updateSolanaWebhookAddresses = async (
  webhookId: string,
  signingKey: string,
  addressesToAdd: string[],
  addressesToRemove: string[],
): Promise<void> => {
  const webhookData = await fetchHeliusWebhookData(webhookId);

  if (!webhookData || webhookData.error) {
    throw new Error('Webhook not found');
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

  const response = await axios.put(
    `${HELIUS_API_BASE_URL}/v0/webhooks/${webhookId}?api-key=${HELIUS_API_KEY}`,
    {
      webhookURL: webhookData.webhookURL,
      transactionTypes: webhookData.transactionTypes,
      webhookType: webhookData.webhookType,
      accountAddresses: newAddresses,
      authHeader: signingKey,
    },
    {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
    },
  );
  if (response.status !== 200) {
    throwExternalError(response, 'Error updating Solana webhook addresses');
  }
};

const fetchHeliusWebhookData = async (webhookId: string) => {
  const response = await axios.get(
    `${HELIUS_API_BASE_URL}/v0/webhooks/${webhookId}?api-key=${HELIUS_API_KEY}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (response.status !== 200) {
    throwExternalError(response, 'Error fetching webhook data');
  }
  const data = response.data;
  return data;
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
): Promise<SubscriptionsDetailsInterface[]> => {
  const res = await subscriptionsRepo.find({
    where: { subscriber_id: subscriberId },
  });
  return res.map((subscription: SubscriptionsEntity) => ({
    address: subscription.address,
    fid: subscription.fid,
    createdAt: subscription.created_at.getTime(),
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
