import { ScrapingResult } from 'shared/scraping';

export class Warpcast {
  private static EXTERNAL_LINK_NODE_SELECTOR = 'a';

  public static getExternalLinks(): ScrapingResult[] {
    const externalLinksNodes =
      [...document.querySelectorAll(Warpcast.EXTERNAL_LINK_NODE_SELECTOR)] ??
      [];

    return externalLinksNodes
      .map((node) => {
        const { height, top } = node.getBoundingClientRect();
        if (!height) {
          return;
        }

        const url = node.getAttribute('href');

        if (!url) {
          return;
        }

        return { node, value: url, top: top + window.scrollY };
      })
      .filter(Boolean);
  }
}
