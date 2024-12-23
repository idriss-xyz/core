import {Webhook} from "./interfaces";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const webhooks: Webhook[] = [];
export const MAX_ADDRESSES_PER_WEBHOOK = 3; // Adjust based on Alchemy's limits - 50000
