# Gitcoin Donations
Gitcoin Donations is a module that holds widget and logic that when combined together support cross chain donations to Gitcoin applications.

## Similarity to IDriss Send
GitcoinDonationWidget works very similar to IDriss Send, that's why we abstracted a lot of parts into reusable IdrissSend component.
This component is used inside `IdrissSendWidget` and `GitcoinDonationWidget`.
Any future modifications of `IdrissSend` component should be followed up by double checking both widgets to make sure there's no regression.

Widget might have race condition with IDriss Send widget and for today's requirement we only want to show one of them with priority
to Gitcoin widget if we detect that given twitter user is having application on active round.

## Adding new chain
- make sure chain configuration exists in `CHAIN` constant in `src/shared/web3/constants.ts`
- add wrapped eth address in `WRAPPED_ETH_ADDRESS_PER_CHAIN_ID` constant in `src/application/gitcoin/constants.ts`
- add donation contract address in `DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID` constant in `src/application/gitcoin/constants.ts`

