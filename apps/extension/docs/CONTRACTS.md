This guide is a technical explanation of how cross-chain donations can be included in the GG20 matching calculations.

### For Consideration
The Allo contract recognizes `tx.origin` as the donor of an allocation. In the case of cross-chain donations, this would mean that the Across bridge relayers filling the transaction would show up as the donors (potentially piling up a bigger sum if the same relayers fill multiple donations). This wrapper contract is issuing atteststions to overcome the issue arising from these falsely classified donors. The `allocate()` call triggered from our contract emits the `Attested` event and points to a schema (see below) containing params `address donor, address recipientId, uint256 roundId, address tokenSent,uint256 amount, address origin`.

### Signature Verification
Cross-chain donations require that the donor signs the voting parameters, ensuring that the donation data is not tempered with during bridging. The signature and voting parameters are verified on the destination chain.

### Function Access Control
The `handleV3AcrossMessage` function verifies that the caller is the authorized Across `SPOKE_POOL`. This makes sure that only verified cross chain donations are processed.

### Attestatons
Donations automatically issue an attestation with EAS. It contains all the needed information to match donations with the original sender address for matching calculations. As cross-chain donations are only accepted when relayed through Across and when the passed message is verified through the signature of the user, the attestations made by our wrapper contract can be trusted as a source of truth for matching calculation. Noone can issue fraudulent attestations through calling our contract. This process is as decentralized as Across’ decentralized network of relayers.

The relevant schemas are deployed on [Arbitrum](https://arbitrum.easscan.org/schema/view/0x199429ee45da2c99fd2617ec4865749ca292009f44ee2a0a43721adef1c9c9df) and [Optimism](https://optimism.easscan.org/schema/view/0x199429ee45da2c99fd2617ec4865749ca292009f44ee2a0a43721adef1c9c9df).

### Miscellaneous 
If for some reason the bridge transaction cannot be filled (transaction was sent just before the round ended and now the Allo contract reverts because the round is over when the relayer tries to fill, or any other reason), the donor receives back their funds on the origin chain after some `fillDeadline` (currently around 6 hours) has passed.

## Matching calculation with cross-chain donations

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
