import { gql } from '@apollo/client';

export const TipHistoryQuery = gql`
  query TimelineForAppQuery($slug: String!, $after: String) {
    timelineForApp(slug: $slug, first: 100, after: $after) {
      edges {
        node {
          timestamp
          network
          transaction {
            hash
            fromUser {
              address
            }
          }
          interpretation {
            processedDescription
            descriptionDisplayItems {
              ... on TokenDisplayItem {
                type
                network
                tokenAddress
                amountRaw
                tokenV2 {
                  symbol
                  decimals
                  name
                  imageUrl
                  marketData {
                    price
                  }
                }
              }
              ... on ActorDisplayItem {
                account {
                  address
                }
              }
              ... on StringDisplayItem {
                stringValue
                type
              }
            }
          }
        }
      }
      pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`;
