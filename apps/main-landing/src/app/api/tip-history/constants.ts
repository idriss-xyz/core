export const TipHistoryQuery = `
  query ($addresses: [Address!], $isSigner: Boolean, $toAddresses: [String!], $after: String) {
    accountsTimeline(addresses: $addresses, toAddresses: $toAddresses, isSigner: $isSigner, first: 25, after: $after) {
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

export const OLDEST_TRANSACTION_TIMESTAMP = 0;
