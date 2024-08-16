import {
  ExternalLinksScrapingResult,
  PostScrapingResult,
  UserScrapingResult,
} from 'shared/scraping';

export class Scraper {
  public static getExternalLinks(): ExternalLinksScrapingResult[] {
    // not used for now
    return [];
  }

  public static getUsers(): UserScrapingResult[] {
    // not used for now
    return [];
  }

  public static getPosts(): PostScrapingResult[] {
    const selector = 'ul > a';
    const posts = [...document.querySelectorAll(selector)];

    return posts
      .map((post) => {
        const username = post
          .querySelector('a')
          ?.getAttribute('href')
          ?.replace('/', '');

        if (!username) {
          return;
        }

        const linkNodeRect = post.getBoundingClientRect();
        if (!linkNodeRect.height) {
          return;
        }

        return {
          node: post,
          top: linkNodeRect.top + window.scrollY,
          data: {
            authorUsername: username,
          },
        };
      })
      .filter(Boolean);
  }
}
