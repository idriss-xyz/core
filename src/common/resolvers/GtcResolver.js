import { GITCOIN_GRAPHQL_API_URL, GET_APPLICATIONS_QUERY } from "application/gitcoin/api";

export const GtcResolver = {
  async fetchApplicants() {
    const timestamp = new Date().toISOString();
    const variables = {
      currentIsoDate: timestamp,
    };

    const response = await fetch(GITCOIN_GRAPHQL_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        query: GET_APPLICATIONS_QUERY,
        operationName: 'Applications',
        variables: variables,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new HandlerError(
        'Something went wrong when fetching snapshot api.',
      );
    }
    const projectTwitters = [];

    const json = await response.json();
    const resultData = json.data;
    Object.keys(resultData).forEach((chain) => {
      resultData[chain].forEach((item) => {
        if (
          item.project &&
          item.project.metadata &&
          item.project.metadata.projectTwitter
        ) {
          projectTwitters.push(
            item.project.metadata.projectTwitter.replace('@', '').toLowerCase(),
          );
        }
      });
    });

    return projectTwitters;
  },

  async getRoundInfo() {
    const names = await this.fetchApplicants();
    return names;
  },
};
