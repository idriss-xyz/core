## Download Extension
* [Chrome / Brave / Arc](https://chrome.google.com/webstore/detail/idriss-crypto/fghhpjoffbgecjikiipbkpdakfmkbmig)

## X (Twitter) Transfers

Sending a transfer through a green IDRISS badge on X (Twitter) and Farcaster clients (Warpcast and Supercast) creates a contract call with IDRISS' smart contracts, which are live on several networks:

| Network                 | Contract Address                               |
|----------------------------|-----------------------------------------------|
| Ethereum                    | [0xe18036D7E3377801a19d5Db3f9b236617979674E](https://etherscan.io/address/0xe18036D7E3377801a19d5Db3f9b236617979674E#code)   |
| Polygon | [0xe35B356ac2c880cCcc769bA9393F0748d94ABBCa](https://polygonscan.com/address/0xe35B356ac2c880cCcc769bA9393F0748d94ABBCa#code)   |
| Optimism                 | [0x43f532d678b6a1587be989a50526f89428f68315](https://optimistic.etherscan.io/address/0x43f532d678b6a1587be989a50526f89428f68315#code)   |
| BNB | [0xdffce6d7a3c1ada65aed49096b380b5b6814fffd](https://bscscan.com/address/0xdffce6d7a3c1ada65aed49096b380b5b6814fffd#code)   |
| zkSync Era     | [0x6753D35A81d52C49485f5fbB93a059046D1f47a8](https://explorer.zksync.io/address/0x6753D35A81d52C49485f5fbB93a059046D1f47a8#contract)   |
| Linea           | [0x7Ef966A9F75Ae230F0583DCD24Ac689E47f533be](https://lineascan.build/address/0x7Ef966A9F75Ae230F0583DCD24Ac689E47f533be#code)   |
| Mantle           | [0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968](https://explorer.mantle.xyz/address/0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968?tab=contract)   |
| Scroll           | [0x324ad1738b9308d5af5e81edd6389bfa082a8968](https://scrollscan.com/address/0x324ad1738b9308d5af5e81edd6389bfa082a8968#code)   |
| Aleph Zero EVM          | [0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4](https://evm-explorer.alephzero.org/address/0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4?tab=contract)   |



## Donations to Public Goods

Donations in the meta-infinite PGF round are routed through the contract on Optimism: 0x43f532d678b6a1587be989a50526f89428f68315.

List of grantees and their associated wallet addresses and X (Twitter) names can be found [here](https://github.com/idriss-xyz/core/blob/master/apps/extension/src/common/customTwitterAccounts.json).

If your project is not on the list or you'd like to change a wallet address/X (Twitter) username, please DM us on X (Twitter) from your official project account or send us an email to hello@idriss.xyz from your official domain.

## Gitcoin Donations
For the first time, donations sent to a project's Gitcoin round through X (Twitter) can be sent cross-chain.

Donations sent on the network the round is running on (same chain donations) are routed directly through Gitcoin's [AlloV2 contracts](https://github.com/allo-protocol/allo-v2). They do not go through any contracts deployed by IDRISS. The AlloV2 contract address on all networks is `0x1133eA7Af70876e64665ecD07C0A0476d09465a1`.

Cross chain donations leverage the Across Protocol through an [Across+ integration](https://docs.across.to/integration-guides/across+-integration). On the origin chain, as well as on the destination chain, donations are routed through our [wrapper contract](https://github.com/idriss-crypto/contracts/blob/DonationWrapper/src/contracts/DonationWrapper.sol). The addresses of this contract on different networks are

| Network                 | Contract Address                               |
|----------------------------|-----------------------------------------------|
| Ethereum Mainnet                    | [0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4](https://etherscan.io/address/0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4#code)   |
| Optimism | [0xd82BDb8391109f8BaD393Ff2CDa9E7Cd56F8239C](https://optimistic.etherscan.io/address/0xd82BDb8391109f8BaD393Ff2CDa9E7Cd56F8239C#code)   |
| Base                | [0x51C2DDC09B67aB9152ACFB6a9a5E7A8DB1485ae8](https://basescan.org/address/0x51C2DDC09B67aB9152ACFB6a9a5E7A8DB1485ae8#code)   |
| Arbitrum One | [0xaA098E5c9B002F815d7c9756BCfce0fC18B3F362](https://arbiscan.io/address/0xaA098E5c9B002F815d7c9756BCfce0fC18B3F362#code)   |
| Linea     | [0xcbf32F0a9BF93256BAD8cD31cF37a3e914245908](https://lineascan.build/address/0xcbf32F0a9BF93256BAD8cD31cF37a3e914245908#code)   |
| zkSync Era                | [0x8F5fc20f5a3e69B7DCc5AC477dCC4484C64897dA](https://explorer.zksync.io/address/0x8F5fc20f5a3e69B7DCc5AC477dCC4484C64897dA#contract)   |

More information regarding technicalities can be found in [CONTRACTS.md](https://github.com/idriss-xyz/core/blob/master/CONTRACTS.md)


## Build
To compile the extension install [pnpm](https://pnpm.io/) and then from CLI

```bash
pnpm
pnpm build:prod
```

Results will appear in buildResults directory: ./buildResults/firefox and ./buildResults/chromium

## License

This project is licensed under [GPLv3](https://github.com/idriss-xyz/core/blob/master/LICENSE)
