export const TipHistoryQuery = `
  query ($addresses: [Address!], $toAddresses: [String!], $isSigner: Boolean, $after: String) {
    accountsTimeline(addresses: $addresses, toAddresses: $toAddresses, isSigner: $isSigner, after: $after, first: 50) {
      edges {
        node {
          timestamp
          network
          transaction {
            hash
            fromUser {
              address
              displayName {
                value
                source
              }
              avatar {
                value {
                  ... on AvatarUrl {
                    url
                  }
                }
                source
              }
            }
            toUser {
              address
            }
          }
          interpretation {
            descriptionDisplayItems {
              ... on TokenDisplayItem {
                network
                amountRaw
                tokenV2 {
                  symbol
                  imageUrlV2
                  onchainMarketData {
                    price
                  }
                  address
                  decimals
                }
              }
              ... on StringDisplayItem {
                stringValue
              }
              ... on ActorDisplayItem {
                account {
                  address
                }
              }
            }
          }
          app {
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const PriceHistoryQuery = `
query ($address: Address!, $network: Network!, $currency: Currency!, $timeFrame: TimeFrame!) {
  fungibleToken(address: $address, network: $network) {
    onchainMarketData {
      price
      priceTicks(currency: $currency, timeFrame: $timeFrame) {
        timestamp
        median
      }
    }
  }
}`;

export const OLDEST_TRANSACTION_TIMESTAMP = 1_734_497_616_000;
