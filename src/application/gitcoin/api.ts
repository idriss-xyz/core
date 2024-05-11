export const GITCOIN_GRAPHQL_API_URL =
  'https://grants-stack-indexer-v2.gitcoin.co/graphql';

export const GET_APPLICATIONS_QUERY = `
query Applications ($currentIsoDate: Datetime!) {
  arbitrum: applications(
    filter: {
      roundId: { in: ["23", "24", "25", "26", "27", "28", "29", "31"] }
      chainId: { equalTo: 42161 }
      status: { equalTo: APPROVED }
      round: {
        donationsStartTime: { lessThan: $currentIsoDate }
        donationsEndTime: { greaterThan: $currentIsoDate }
      }
    }
    first: 1000
    offset: 0
  ) {
    ...Application
  }

  optimism: applications(
    filter: {
      roundId: { in: ["9"] }
      chainId: { equalTo: 10 }
      status: { equalTo: APPROVED }
      round: {
        donationsStartTime: { lessThan: $currentIsoDate }
        donationsEndTime: { greaterThan: $currentIsoDate }
      }
    }
    first: 1000
    offset: 0
  ) {
    ...Application
  }
}

fragment Application on Application {
  roundId
  chainId
  project {
    ...Project
  }
}

fragment Project on Project {
  id
  name
  metadata
  anchorAddress
  registryAddress
}
`;

export class Api {
  public static getApplications() {
    return fetch(GITCOIN_GRAPHQL_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        query: GET_APPLICATIONS_QUERY,
        operationName: 'Applications',
        variables: {
          currentIsoDate: new Date().toISOString(),
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
