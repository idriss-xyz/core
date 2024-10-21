interface ScrapingResult {
  nodeId: string;
  node: Element;
  top: number;
}

export interface UserScrapingResult extends ScrapingResult {
  data: {
    username: string;
  };
}

export interface PostScrapingResult extends ScrapingResult {
  data: {
    authorUsername: string;
  };
}

export interface ExternalLinksScrapingResult extends ScrapingResult {
  data: {
    link: string;
  };
}

export interface ScrapingResults {
  users: UserScrapingResult[];
  posts: PostScrapingResult[];
  externalLinks: ExternalLinksScrapingResult[]; // TODO: external link is probably subset of post
}
