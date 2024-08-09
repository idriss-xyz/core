import { ExternalLinksScrapingResult } from 'shared/scraping';

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
}
