import { Connection } from '@solana/web3.js';
import express from 'express';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const connection = new Connection(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
    );
    const { base64SerializedTx } = req.body;
    const serializedTx = new Uint8Array(
      Buffer.from(base64SerializedTx, 'base64'),
    );
    const transactionHash = await connection.sendRawTransaction(serializedTx, {
      maxRetries: 5,
      skipPreflight: true,
    });
    const latestBlockhash = await connection.getLatestBlockhash();

    const receipt = await connection.confirmTransaction(
      {
        signature: transactionHash,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      'finalized',
    );

    if (receipt.value.err) {
      res.status(500).json({ error: receipt.value.err, transactionHash });
    } else {
      res.status(200).json({ transactionHash });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
