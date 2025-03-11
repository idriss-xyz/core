export const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql';

export const TipHistoryQuery = `
  query ($addresses: [Address!], $toAddresses: [String!], $isSigner: Boolean, $after: String) {
    accountsTimeline(addresses: $addresses, toAddresses: $toAddresses, isSigner: $isSigner, after: $after, first: 25) {
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

export const OLDEST_TRANSACTION_TIMESTAMP = 1_700_929_698;

// Todo: Add import from package once refactor is done
export const CHAIN_TO_IDRISS_TIPPING_ADDRESS = {
  137: '0xe35B356ac2c880cCcc769bA9393F0748d94ABBCa',
  1: '0xe18036D7E3377801a19d5Db3f9b236617979674E',
  10: '0x43F532D678b6a1587BE989a50526F89428f68315',
  8453: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  5000: '0x324Ad1738B9308D5AF5E81eDd6389BFa082a8968',
  41455: '0xcA6742d2d6B9dBFFD841DF25C15cFf45FBbB98f4',
  2020: '0x74BD1b29B997ec081eb7AF06F2fd67CbfC74D26e',
  2741: '0xEeFA4f7F4e9104D16673D0C2fE3D0bF4c45A7804',
} as const;
