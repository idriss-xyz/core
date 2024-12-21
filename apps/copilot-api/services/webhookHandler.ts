import {Request, Response} from "express";
import {AlchemyWebhookEvent, CachedTransaction} from "../interfaces";
import {NULL_ADDRESS} from "../constants";
import {
    getSubscribersByAddress,
    isSubscribedAddress,
} from "./subscriptionManager";
import {Socket, Server as SocketIOServer} from "socket.io";
import {SwapData} from "../types";

const eventCache: { [txHash: string]: CachedTransaction } = {};

// Declare module-level variables
let io: SocketIOServer;
let connectedClients: Map<string, Socket>;

// Webhook handler function
export function webhookHandler(
    ioInstance: SocketIOServer,
    connectedClientsMap: Map<string, Socket>
) {
    // Assign to module-level variables
    io = ioInstance;
    connectedClients = connectedClientsMap;

    return async (req: Request, res: Response): Promise<void> => {
        const webhookEvent = req.body as AlchemyWebhookEvent;

        await handleIncomingEvent(webhookEvent);

        res.send("Event received");
    };
}

// Handle incoming events and add them to the cache
async function handleIncomingEvent(
    webhookEvent: AlchemyWebhookEvent
): Promise<void> {
    const activities = webhookEvent.event.activity;
    if (!activities || activities.length === 0) {
        console.error("No activity found in the webhook event.");
        return;
    }

    const txHash = activities[0].hash;
    if (!txHash) {
        console.error("Transaction hash is missing in the event data.");
        return;
    }

    // Initialize cache entry if it doesn't exist
    if (!eventCache[txHash]) {
        eventCache[txHash] = {
            activities: [],
            timestamp: Date.now(),
        };
    }

    for (const activity of activities) {
        activity.network = webhookEvent.event.network;
    }

    console.log("New event:");
    console.log(activities);

    // Add activities to the cache
    eventCache[txHash].activities.push(...activities);
}

// Scheduler to process the cache every 2 seconds
setInterval(async () => {
    const now = Date.now();
    const cacheEntries = Object.entries(eventCache);

    for (const [txHash, cachedTransaction] of cacheEntries) {
        const {activities, timestamp} = cachedTransaction;
        const swapData = await extractSwapData(txHash, activities);
        console.log(swapData);

        if (swapData.isComplete) {
            // Complete swap
            console.log("Complete Swap:", JSON.stringify(swapData, null, 2));

            // Send swapData to subscribed users
            const addresses = [swapData.from, swapData.to];
            for (const address of addresses) {
                if (address) {
                    const subscriberIds = await getSubscribersByAddress(
                        address
                    );
                    for (const subscriberId of subscriberIds) {
                        const clientSocket = connectedClients.get(subscriberId);
                        if (clientSocket) {
                            clientSocket.emit("swapEvent", swapData);
                            console.log(
                                `Sent swap event to user ${subscriberId}`
                            );
                        }
                    }
                }
            }

            // Remove from cache
            delete eventCache[txHash];
        } else {
            // Check if the transaction has been in the cache for more than 2 seconds
            if (now - timestamp >= 2000) {
                // Incomplete swap, time expired
                console.log(
                    "Incomplete Swap:",
                    JSON.stringify(swapData, null, 2)
                );
                // Remove from cache
                delete eventCache[txHash];
            }
            // If not expired, keep it in the cache
        }
    }
}, 2000);

// Extract swap data from activities
async function extractSwapData(
    txHash: string,
    activities: any[]
): Promise<SwapData> {
    const swapData: SwapData = {
        transactionHash: txHash,
        from: null,
        to: null,
        tokenIn: null,
        tokenOut: null,
        timestamp: new Date().toISOString(),
        isComplete: false,
    };

    for (const activity of activities) {
        const category = activity.category;

        if (category === "external") {
            // Handle ETH transfers
            const isEthTransfer =
                activity.asset === "ETH" && activity.value > 0;
            if (isEthTransfer) {
                if (
                    (await isSubscribedAddress(activity.fromAddress)) &&
                    !swapData.tokenOut
                ) {
                    // User sent ETH (tokenOut)
                    const tokenOut = {
                        address: NULL_ADDRESS,
                        symbol: activity.asset,
                        amount: activity.value,
                        decimals: activity.rawContract.decimals,
                        network: activity.network,
                    };
                    swapData.tokenOut = tokenOut;
                }
            }
        } else if (category === "token") {
            // Handle ERC20 token transfers
            const token = {
                address: activity.rawContract.address,
                symbol: activity.asset,
                amount: activity.value,
                decimals: activity.rawContract.decimals,
                network: activity.network,
            };
            if (
                (await isSubscribedAddress(activity.toAddress)) &&
                !swapData.tokenIn
            ) {
                // User received token (tokenIn)
                swapData.tokenIn = token;
                swapData.from = activity.toAddress;
                swapData.to = activity.fromAddress;
            } else if (
                (await isSubscribedAddress(activity.fromAddress)) &&
                !swapData.tokenOut
            ) {
                // User sent token (tokenOut)
                swapData.tokenOut = token;
                swapData.from = activity.fromAddress;
                swapData.to = activity.toAddress;
            }
        } else if (category === "internal") {
            // User receives ETH
            const isEthTransfer =
                activity.asset === "ETH" && activity.value > 0;
            if (isEthTransfer) {
                if (
                    (await isSubscribedAddress(activity.toAddress)) &&
                    !swapData.tokenIn
                ) {
                    // User received ETH (tokenIn)
                    const tokenIn = {
                        address: NULL_ADDRESS,
                        symbol: activity.asset,
                        amount: activity.value,
                        decimals: activity.rawContract.decimals,
                        network: activity.network,
                    };
                    swapData.tokenIn = tokenIn;
                    swapData.from = activity.toAddress;
                    swapData.to = activity.fromAddress;
                }
            }
        }
    }

    // Check if swap is complete
    swapData.isComplete = isCompleteSwap(swapData);

    return swapData;
}

// Function to determine if the swap is complete
function isCompleteSwap(swapData: SwapData): boolean {
    // Check all required fields
    const requiredFields = [
        "transactionHash",
        "from",
        "to",
        "tokenIn",
        "tokenOut",
    ];

    for (const field of requiredFields) {
        if (
            swapData[field as keyof SwapData] === null ||
            swapData[field as keyof SwapData] === undefined
        ) {
            return false;
        }
        if (
            (field === "tokenIn" || field === "tokenOut") &&
            (swapData[field as keyof SwapData] as { amount: number })[
                "amount"
                ] === null
        ) {
            return false;
        }
    }

    // Ensure tokenIn and tokenOut are different
    if (
        swapData.tokenIn!.address.toLowerCase() ===
        swapData.tokenOut!.address.toLowerCase()
    ) {
        return false;
    }

    return true;
}
