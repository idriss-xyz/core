## Download
* [Chrome / Brave](https://chrome.google.com/webstore/detail/idriss-crypto/fghhpjoffbgecjikiipbkpdakfmkbmig)
* [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/idrisscrypto/jgnmbeoapdbocaajhmfjhldhcpngfiol)
* [Mozilla](https://addons.mozilla.org/pl/firefox/addon/idriss-crypto/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

## Twitter Transfers

Sending a transfer through an IDriss badge on Twitter creates a contract call with IDriss' smart contracts. They are live on several networks:

| Network                 | Contract Address                               |
|----------------------------|-----------------------------------------------|
| Ethereum                    | 0xe18036D7E3377801a19d5Db3f9b236617979674E   |
| Polygon | 0xe35B356ac2c880cCcc769bA9393F0748d94ABBCa   |
| Optimism                 | 0x43f532d678b6a1587be989a50526f89428f68315   |
| BNB | 0xdffce6d7a3c1ada65aed49096b380b5b6814fffd   |
| zkSync Era     | 0x6753D35A81d52C49485f5fbB93a059046D1f47a8   |
| Linea           | 0x7Ef966A9F75Ae230F0583DCD24Ac689E47f533be   |
| PGN      | 0x43f532d678b6a1587be989a50526f89428f68315   |

Additionally, sending through a grey badge interacts with 0xf333EDE8D49dD100F02c946809C9F5D9867D10C0 on Polygon.

## Gitcoin GG18 Donations
Donations on Twitter sent to a project's Gitcoin logo are not going through IDriss' contracts, but to these Gitcoin contracts directly:

| Round Name                 | Contract Address                               |
|----------------------------|-----------------------------------------------|
| **Core Rounds**            |                                               |
| OSS  (OP)                      | 0x8de918f0163b2021839a8d84954dd7e8e151326d   |
| Web3 Community and Education  (OP) | 0x2871742b184633f8dc8546c6301cbc209945033e   |
| Climate   (OP)                 | 0xb6be0ecafdb66dd848b0480db40056ff94a9465d   |
| Ethereum Infrastructure   (PGN) | 0x222ea76664ed77d18d4416d2b2e77937b76f0a35   |
| **Featured Rounds**        |                                               |
| ReFi DAO Local Node   (OP)     | 0x10be322de44389ded49c0b2b73d8c3a1e3b6d871   |
| Zuzalu     (OP)                | 0x5b95acf46c73fd116f0fedadcbedf453530e35d0   |
| Token Engineering   (OP)       | 0xc5fdf5cff79e92fac1d6efa725c319248d279200   |
| Latin America    (OP)          | 0xf591e42dfdfe8e62c2085ccaadfe05f84d89d0c6   |
| Web3 Social   (OP)             | 0x9331fde4db7b9d9d1498c09d30149929f24cf9d5   |
| Global Chinese Community  (OP)  | 0x30c381033aa2830ceb0aa372c2e4d28f004b3db9   |

Donations on Gitcoin's Twitter profile are routed to the treasury and matching pool addresses on these networks:
| Network                 | Gitcoin Treasury Address                               |
|----------------------------|-----------------------------------------------|
| Optimism                      | 0x0cC7a824B8760b426c597BbF997524DE0cad9988 (optimism.grants.gitcoin.eth) |
| PGN (Public Goods Network) | 0x555277050AF4F7A11DB559d5ca1E4C4833a4Dbdd  (pgn.grants.gitcoin.eth) |


## Build
To compile the extension install [yarn](https://yarnpkg.com/) and then from CLI

```bash
yarn
yarn buildOnce
```

Results will appear in buildResults directory: ./buildResults/firefox and ./buildResults/chromium
