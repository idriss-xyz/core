interface TwitterHandlePage {
  name: 'twitter';
  type: 'handle';
  handle: string;
}

interface TwitterMainPage {
  name: 'twitter';
  type: 'main';
}

export type TwitterPage = TwitterHandlePage | TwitterMainPage;

export interface UnknownPage {
  name: 'unknown';
}
