import { gql } from '@apollo/client';

export const TipHistoryQuery = gql`
  query TimelineForAppQuery($slug: String!) {
    timelineForApp(slug: $slug) {
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
            descriptionDisplayItems {
              ... on TokenDisplayItem {
                network
                amountRaw
                tokenV2 {
                  symbol
                  imageUrlV2
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
              }
            }
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
