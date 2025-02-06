'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
  useQuery,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Spinner } from '@idriss-xyz/ui/spinner';

import { TopBar } from '@/components';
import {
  backgroundLines2,
  backgroundLines3,
  IDRISS_ICON_CIRCLE,
} from '@/assets';
import { Providers } from '@/app/creators/providers';
import { formatEther } from 'viem';

interface UserDisplayName {
  value: string;
}

interface User {
  address?: string;
  displayName: UserDisplayName;
}

interface Transaction {
  hash: string;
  fromUser: User;
  toUser: User;
}

interface TokenV2 {
  symbol: string;
  decimals: number;
  name: string;
  imageUrl: string;
  marketData: {
    price: number;
  };
}

interface DescriptionDisplayItem {
  type: string;
  network: string;
  tokenAddress: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

interface Interpretation {
  processedDescription: string;
  description: string;
  descriptionDisplayItems: DescriptionDisplayItem[];
  inboundAttachments: any[];
  outboundAttachments: {
    type: string;
    network: string;
    tokenAddress: string;
    amountRaw: string;
  }[];
}

interface Node {
  timestamp: number;
  network: string;
  transaction: Transaction;
  interpretation: Interpretation;
}

interface Edge {
  node: Node;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface TimelineForApp {
  edges: Edge[];
  pageInfo: PageInfo;
}

interface ApiResponse {
  timelineForApp: TimelineForApp;
}

// Set up Apollo Client
const httpLink = createHttpLink({
  uri: 'https://public.zapper.xyz/graphql',
});

const API_KEY = process.env.ZAPPER_API_KEY ?? '';

const encodedKey = btoa(API_KEY);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Basic ${encodedKey}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const PortfolioQuery = gql`
  query TimelineForAppQuery(
    $slug: String!
    $first: Int
    $after: String
    $spamFilter: Boolean
  ) {
    timelineForApp(
      slug: $slug
      first: $first
      after: $after
      spamFilter: $spamFilter
    ) {
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
              }
            }
            toUser {
              displayName {
                value
              }
            }
          }
          interpretation {
            processedDescription
            description
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
                    price(currency: USD)
                  }
                }
              }
              ... on NFTDisplayItem {
                type
                network
                collectionAddress
                tokenId
                quantity
                nftToken {
                  collection {
                    name
                  }
                }
              }
            }
            inboundAttachments {
              ... on TokenDisplayItem {
                type
                network
                tokenAddress
                amountRaw
              }
            }
            outboundAttachments {
              ... on TokenDisplayItem {
                type
                network
                tokenAddress
                amountRaw
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

// ts-unused-exports:disable-next-line
export default function Dashboard() {
  return (
    <ApolloProvider client={client}>
      <DashboardContent />
    </ApolloProvider>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const address = searchParameters.get('streamerAddress');

  const { data } = useQuery<ApiResponse>(PortfolioQuery, {
    variables: {
      slug: 'idriss',
    },
  });

  console.log(data);

  if (!address) {
    router.push('/creators');
    return;
  }

  if (!data) {
    return <Spinner className="size-16" />;
  }

  return (
    <Providers>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#b5d8ae_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="container relative mt-8 flex max-w-[1240px] flex-col items-center overflow-hidden rounded-xl bg-white px-1 pb-3 pt-6 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
          <link rel="preload" as="image" href={backgroundLines3.src} />
          <img
            src={backgroundLines3.src}
            className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
            alt=""
          />

          <div className="mb-6 flex w-full items-center">
            <IconButton
              asLink
              href="/creators"
              iconName="ArrowLeft"
              intent="tertiary"
              size="medium"
            />
            <h1 className="my-auto self-start text-balance text-heading4">
              Tips history for {address}
            </h1>
          </div>

          <div className="flex w-full flex-col gap-y-3 px-3">
            {data.timelineForApp.edges.map((edge) => {
              if (
                !edge.node.transaction.fromUser.address ||
                !edge.node.interpretation.descriptionDisplayItems[0]
              ) {
                return;
              }

              return (
                <Item
                  key={edge.node.transaction.hash}
                  timestamp={edge.node.timestamp}
                  from={edge.node.transaction.fromUser.address}
                  details={edge.node.interpretation.descriptionDisplayItems[0]}
                  processedDescription={
                    edge.node.interpretation.processedDescription
                  }
                />
              );
            })}
          </div>
        </div>
      </main>
    </Providers>
  );
}

type ItemProperties = {
  from: string;
  timestamp: number;
  processedDescription: string;
  details: DescriptionDisplayItem;
};

const Item = ({
  from,
  details,
  timestamp,
  processedDescription,
}: ItemProperties) => {
  const avatarUrl = undefined;
  const customIcon = IDRISS_ICON_CIRCLE.src;

  return (
    <div className="grid w-full grid-cols-2 gap-x-4">
      <div className="flex w-full items-start gap-x-2 rounded-xl bg-white p-4 shadow-lg">
        <div className="flex shrink-0 items-center justify-center">
          <img
            className={`size-12 rounded-full ${
              avatarUrl ? 'border border-neutral-400' : ''
            }`}
            src={avatarUrl ?? customIcon}
            alt={avatarUrl ? 'Donor avatar' : 'IDRISS logo'}
          />
        </div>
        <div className="flex flex-col justify-center gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-label3 text-neutral-900">
              {from}{' '}
              <span className="text-body3 text-neutral-600">sent $20</span>
            </p>
          </div>
          <p className="text-body5 text-neutral-600">{processedDescription}</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-2">
        <span>{new Date(timestamp).toLocaleDateString()}</span>
        <span>
          {formatEther(BigInt(details.amountRaw))} {details.tokenV2.name}
        </span>
      </div>
    </div>
  );
};
