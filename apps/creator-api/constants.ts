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
            decodedInputV2 {
              data {
                value
                name
              }
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
                  displayName {
                    source
                    value
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

export const OLDEST_TRANSACTION_TIMESTAMP = 1_702_339_200;

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

export const CREATOR_LINKS: Record<string, string> = {
  '0xc4607e7ab9200f955ec617698b2a4ee0c66f3fb4':
    'https://www.idriss.xyz/creators/donate?address=exile-esports.eth&token=ETH,USDC,PRIME&network=Base,Ethereum&creatorName=Exile%20Esports',
  '0x7d716741d2c37925e5e15123025400be80ec796d':
    'https://www.idriss.xyz/creators/donate?address=0x7D716741D2c37925e5E15123025400Be80ec796d&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,DEGEN&network=Aleph,Base,Ethereum,Mantle,Optimism,Polygon',
  '0xee61f8d793fbe0cd2459c85160919128690cbba7':
    'https://www.idriss.xyz/creators/donate?address=0xeE61f8D793fBE0CD2459C85160919128690CBBA7&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,RON,AXS,PENGU,DEGEN,IDRISS&network=Abstract,Aleph,Ronin,Base,Ethereum,Mantle,Optimism,Polygon&creatorName=Dmoney%20Donations',
  '0xff03e5daf6a3c0441795f7dc83b873c2f2567692':
    'https://www.idriss.xyz/creators/donate?address=qflux.eth&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,DEGEN&network=Aleph,Base,Ethereum,Mantle,Optimism,Polygon&creatorName=qFlux888',
  '0x8e7684a69fde04a891b5eaa2ebc38eb0e0b0eca3':
    'https://www.idriss.xyz/creators/donate?address=feno.eth&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,DEGEN&network=Aleph,Base,Ethereum,Mantle,Optimism,Polygon&creatorName=feno',
  '0xc078ea9365e3eb0538ba51ce53a8f75694bdd2f3':
    'https://www.idriss.xyz/creators/donate?address=0xc078ea9365e3eb0538ba51ce53a8f75694bdd2f3&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,DEGEN&network=Aleph,Base,Ethereum,Mantle,Optimism,Polygon&creatorName=Antonín%20Malina',
  '0x97ddb656b2b18c9aa46f998da5b22963c8df9fac':
    'https://www.idriss.xyz/creators/donate?address=0x97DDB656B2B18c9aA46f998da5b22963c8dF9FaC&token=USDC,DAI,PRIME,GHST,PDT,IDRISS,YGG,ETH&network=Base&creatorName=The%20Game%20Cellar',
  '0x4f9dc8c989a8143c5a9c28682bdf46c212ebefb6':
    'https://www.idriss.xyz/creators/donate?address=0x4f9dC8C989A8143C5a9c28682BDF46c212EbEfB6&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,RON,AXS,PENGU,DEGEN,IDRISS&network=Abstract,Aleph,Ronin,Base,Ethereum,Mantle,Optimism,Polygon&creatorName=ExcelSor',
  '0x32e8cb4560619f1afed4d18c309f5b4104d94238':
    'https://www.idriss.xyz/creators/donate?address=0x32e8cB4560619f1AfEd4D18C309F5b4104D94238&token=ETH%2CUSDC%2CDAI%2CPRIME%2CGHST%2CYGG%2CPDT%2CRON%2CAXS%2CDEGEN%2CIDRISS&network=Base%2CEthereum&creatorName=tyler_ygg',
  '0xbd70ae53e48b3b94e75a9895e8b7c092856709ff':
    'https://www.idriss.xyz/creators/donate?address=0xbD70Ae53e48B3B94E75A9895e8B7c092856709FF&token=ETH,USDC,PRIME,YGG,PDT,RON,AXS,PENGU,DEGEN,IDRISS&network=Abstract,Base,Ethereum,Optimism&creatorName=Jeremy',
  '0x7a0a871c626f41b1b1caec66b926b1f788eb747f':
    'https://www.idriss.xyz/creators/donate?address=0x7a0A871C626f41b1b1CAeC66B926B1f788eb747F&token=ETH,USDC,PRIME,YGG,PDT&network=Base,Ethereum&creatorName=Sequinox',
  '0x8b7164183698ceb263367766de76037ab80e22ad':
    'https://www.idriss.xyz/creators/donate?address=0x8b7164183698cEB263367766De76037AB80E22ad&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,DEGEN&network=Base,Ethereum&creatorName=Viper',
  '0xafbee4d7f883e6ab842e9623a9d595ff6b7aafd7':
    'https://www.idriss.xyz/creators/donate?address=0xAfbEe4d7f883E6Ab842e9623a9d595Ff6B7AAfD7&token=PRIME&network=Base,Ethereum&creatorName=Tales',
  '0x0519861371532dbcdba321ddc0e3108885f6e2ff':
    'https://www.idriss.xyz/creators/donate?address=0x0519861371532dBcDBA321DdC0E3108885f6E2FF&token=ETH,USDC,DAI,PRIME,GHST,YGG,PDT,RON,AXS,PENGU,DEGEN,IDRISS&network=Abstract,Aleph,Ronin,Base,Ethereum,Mantle,Optimism,Polygon&creatorName=Dur4zn1ll0',
};

export const NETWORK_TO_ALCHEMY = {
  BASE_MAINNET: 'base-mainnet',
  ABSTRACT_MAINNET: 'abstract-mainnet',
  ETHEREUM_MAINNET: 'eth-mainnet',
  POLYGON_MAINNET: 'polygon-mainnet',
  OPTIMISM_MAINNET: 'op-mainnet',
  MANTLE_MAINNET: 'mantle-mainnet',
  RONIN_MAINNET: 'ronin-mainnet',
} as const;

export const ALCHEMY_NATIVE_TOKENS = {
  ETHEREUM_MAINNET: 'ETH',
  ABSTRACT_MAINNET: 'ETH',
  BASE_MAINNET: 'ETH',
  MANTLE_MAINNET: 'MNT',
  OPTIMISM_MAINNET: 'ETH',
  POLYGON_MAINNET: 'MATIC',
  RONIN_MAINNET: 'RON',
} as const;

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
