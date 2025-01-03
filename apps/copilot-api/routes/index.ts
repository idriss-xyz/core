import express from 'express'
import {throwInternalError} from "../middleware/error.middleware";
import {subscribeAddress, unsubscribeAddress} from "../services/subscriptionManager";
import connectedClients from '../index'
import {verifyToken} from "../middleware/auth.middleware";

const router = express.Router();

router.get('/', (_, res) => {
    res.status(200).send('Express')
})

router.post('/subscribe', verifyToken(), async (req, res) => {
    const {subscriberId, address} = req.body;

    if (!subscriberId || !address) {
        res.status(400).json({error: 'subscriberId and address are required'});
        return
    }

    try {
        await subscribeAddress(subscriberId, address);

        res.status(200).json({message: `Subscribed ${subscriberId} to ${address}`})

    } catch (err) {
        throwInternalError(res, 'Error subscribing address', err)
    }
});

router.post('/unsubscribe', verifyToken(), async (req, res) => {
    const {subscriberId, address} = req.body;

    if (!subscriberId || !address) {
        res.status(400).json({error: 'subscriberId and address are required'});
        return
    }

    try {
        await unsubscribeAddress(subscriberId, address);

        res.status(200).json({message: `Unsubscribed ${subscriberId} to ${address}`})

    } catch (err) {
        throwInternalError(res, 'Error unsubscribing address', err)
    }
})

router.get('/test-swap', async (req, res) => {
    const swapData = {
        transactionHash:
            "0xcbe526713e8c2095369191287c1fd4c1832716a55abe0b58db7ee91bebe21542",
        from: "0x4a3755eb99ae8b22aafb8f16f0c51cf68eb60b85",
        to: "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
        tokenIn: {
            address: "0xfa980ced6895ac314e7de34ef1bfae90a5add21b",
            symbol: "PRIME",
            amount: 0.33961864050271173,
            decimals: 18,
            network: "BASE_MAINNET",
        },
        tokenOut: {
            address: "0x4200000000000000000000000000000000000006",
            symbol: "WETH",
            amount: 0.001,
            decimals: 18,
            network: "BASE_MAINNET",
        },
        timestamp: "2024-10-28T16:13:17.698Z",
        isComplete: true,
    };

    // Validate swapData here if necessary
    if (!swapData || !swapData.isComplete) {
        res.status(400).json({error: "Invalid swap data"});
        return;
    }

    try {
        const subscriberId = "id1";
        const clientSocket = connectedClients.get(subscriberId);
        if (clientSocket) {
            clientSocket.emit("swapEvent", swapData);
            console.log(`Sent swap event to user ${subscriberId}`);
        }

        res.status(200).json({message: "Swap event sent to subscribers"});
    } catch (err) {
        throwInternalError(res, 'Error sending swap event', err);
    }
})

export default router;