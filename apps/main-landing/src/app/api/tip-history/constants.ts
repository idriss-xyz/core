export const TipHistoryQuery = `
  query ($addresses: [Address!], $isSigner: Boolean) {
    accountsTimeline(addresses: $addresses, isSigner: $isSigner, first: 75) {
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
