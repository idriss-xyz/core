interface ScrapingResult {
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
