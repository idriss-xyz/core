const GITCOIN_GRAPHQL_API_URL = 'https://api.idriss.xyz/gitcoin-rounds';

export class Api {
  public static getApplications() {
    return fetch(GITCOIN_GRAPHQL_API_URL);
  }
}
