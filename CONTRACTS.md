## Matching calculation with cross-chain donations
This guide is a technical explanation of how cross-chain donations can be included in the GG20 matching calculations.

Using the GraphQL indexer provided by [EAS](https://github.com/ethereum-attestation-service/eas-docs-site/blob/main/docs/developer-tools/api.md), we can query all successful cross chain donations using
```
query ExampleQuery($where: AttestationWhereInput) {
  attestations(where: $where) {
    attester
    data
    recipient
    txid
    id
    time
    timeCreated
  }
}
```

with variable
```
{
  "where": {
    "attester": {
      "equals": "0xd82BDb8391109f8BaD393Ff2CDa9E7Cd56F8239C"
    }
  }
}
```
 for Optimism, and
 ```
{
  "where": {
    "attester": {
      "equals": "0xaA098E5c9B002F815d7c9756BCfce0fC18B3F362"
    }
  }
}
```
for Arbitrum.

The relevant indexer URLs are 
https://optimism.easscan.org/graphql and https://arbitrum.easscan.org/graphql.
The `txid` return parameter is the transaction hash that can be matched with the `allocate()` transaction showing up in the Gitcoin indexer. 
The `data` parameter is `bytes` encoded using
```
data = abi.encode(
                _donor, // address
                _recipientId, // address
                _round, // uint256
                _tokenSent, // address
                _amount, // uint256
                _relayer // address
            )
```
so one can easily decode it to get `_donor` as the original sender address using
```
const types = [
    "address", // _donor
    "address", // _recipientId
    "uint256", // _round
    "address", // _tokenSent
    "uint256", // _amount
    "address"  // _relayer
];

const decoded = ethers.utils.defaultAbiCoder.decode(types, data);
```

If this is not done, the relayer address (`tx.origin`) of Across' decentralized relayer network would show up as the donor in Gitcoin's matching calculations.
