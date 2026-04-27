# IDRISS
This is the open-source repository for IDRISS apps.

## Interfaces
* <a href="https://idriss.xyz" target="_blank">IDRISS landing page</a>
* <a href="https://idriss.xyz/twitch-extension" target="_blank">Twitch Extension</a>
* <a href="https://idriss.xyz/vault" target="_blank">Vault</a>

## Install dependecies
In the root, run

```bash
pnpm install
```

to install dependencies for all apps in this monorepo.

### Build (extension)
To compile the extension, run

```bash
pnpm extension:prod
```
Results will appear in buildResults directory: ./buildResults/firefox and ./buildResults/chromium


### Build (Landing page / IDRISS App / Vault)

To compile and run the landing page and IDRISS App locally, run these commands in separate terminals:

```bash
pnpm main-landing:dev
```

```bash
pnpm creator-api:dev
```

The landing page is running on port `3000`, the api on port `4000`.

Remember to configure API keys in `apps/creator-api/.env.development` for the `creator-api` backend and in `/apps/main-landing/.env.development` for the `creator` app.


### Socials / Resources
* <a href="https://x.com/idriss_xyz" target="_blank">X (Twitter)</a>
* <a href="https://docs.idriss.xyz/" target="_blank">Docs</a>
* <a href="https://docs.idriss.xyz/resources/brand" target="_blank">Brand</a>

## Claiming IDRISS from the vault contract

The IDRISS apps will be discontinued on May 31, 2026. Token claims and vault withdrawals remain possible directly via smart contract on Base mainnet after that date.

### Rewards contract (airdrop claims)

Address: `0x4D66A8e9Da1F007802338B372aD348B78b455aBB`

| Function | Description |
|---|---|
| `claim()` | Collect all pending IDRISS token rewards |
| `rewards(address)` | Check claimable amount for a given address |

```json
[
  { "inputs": [], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "", "type": "address" }], "name": "rewards", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
]
```

### Vault contract

Address: `0x085e2DC1b05dcdbE011B5ad377C9f2fcD69B7057`

| Function | Description |
|---|---|
| `withdraw(amount)` | Unstake IDRISS tokens |
| `getStakedBalance(address)` | Check staked balance for a given address |

```json
[
  { "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "user", "type": "address" }], "name": "getStakedBalance", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
]
```

### How to interact using Remix

1. Go to [remix.ethereum.org](https://remix.ethereum.org/)
2. In the file explorer (left sidebar), create a new file named `contract.abi` and paste the ABI above into it.
3. In the **Deploy & Run Transactions** tab, set Environment to **Browser Extension** and connect your wallet to Base (chain ID 8453).
4. Under **Deployed Contracts**, click **+ Add Contract**, paste the contract address, and click **Add**.
5. Use `getStakedBalance` or `rewards` to check your balance, then call `withdraw` or `claim` to execute.

And with that, this repo goes into read-only mode. Thanks for all. 🫡
### License

This project is licensed under [GPLv3](https://github.com/idriss-xyz/core/blob/master/LICENSE).
