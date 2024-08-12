import {
  ExternalLinksScrapingResult,
  PostScrapingResult,
} from 'shared/scraping';

export class Scraper {
  public static getExternalLinks(): ExternalLinksScrapingResult[] {
    const selector = 'a';
    const externalLinksNodes = [...document.querySelectorAll(selector)] ?? [];

    return externalLinksNodes
      .map((node) => {
        const { height, top } = node.getBoundingClientRect();
        if (!height) {
          return;
        }

        const link = node.getAttribute('href');

        if (!link) {
          return;
        }

        return {
          node,
          top: top + window.scrollY,
          data: {
            link,
          },
        };
      })
      .filter(Boolean);
  }

  public static getPosts(): PostScrapingResult[] {
    const selector = '.min-h-screen > .fade-in > div';
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
