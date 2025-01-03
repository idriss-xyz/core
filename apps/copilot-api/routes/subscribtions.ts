import express from 'express'
import {getSubscriberAddresses} from "../services/subscriptionManager";
import {throwInternalError} from "../middleware/error.middleware";
import {verifyToken} from "../middleware/auth.middleware";


const router = express.Router();


router.get('/:subscriberId', verifyToken(), async (req, res) => {
    const {subscriberId} = req.params || {}
    try {
        const addresses = await getSubscriberAddresses(subscriberId);
        res.status(200).json({subscriberId, addresses});
    } catch (error) {
        throwInternalError(res, 'Error fetching subscriptions', error)
    }


})

export default router