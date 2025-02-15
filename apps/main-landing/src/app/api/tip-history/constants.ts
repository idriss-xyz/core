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
                }
              }
              ... on StringDisplayItem {
                stringValue
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

export const OLDEST_TRANSACTION_TIMESTAMP = 1_734_497_616_000;
