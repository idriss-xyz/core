import { TwitterPage, UnknownPage } from './types';

export class Twitter {
  private static TWITTER_HANDLE_PAGE_REGEX =
    '^https:\\/\\/twitter\\.com\\/(\\w+)';
  private static TWITTER_MAIN_PAGE_REGEX = '^https://twitter.com/home?$';
  private static USERNAME_NODE_SELECTOR = '[data-testid="User-Name"]';
  private static EXTERNAL_LINK_NODE_SELECTOR = 'a[href^="https://t.co"]';

  public static getExternalLinksNodes(): Element[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, unicorn/prefer-spread, prettier/prettier
    return Array.from(document.querySelectorAll(this.EXTERNAL_LINK_NODE_SELECTOR)) ?? [];
  }

  static getUsernamesNodes(): Element[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, unicorn/prefer-spread, prettier/prettier
    return Array.from(document.querySelectorAll(this.USERNAME_NODE_SELECTOR)) ?? [];
  }

  static extractHandle(url: string) {
    const match = url.match(new RegExp(Twitter.TWITTER_HANDLE_PAGE_REGEX));

    if (match) {
      const handle = match[1];
      return handle;
    } else {
      return;
    }
  }

  static getPage(url: string): TwitterPage | UnknownPage {
    if (new RegExp(Twitter.TWITTER_MAIN_PAGE_REGEX).test(url)) {
      return { name: 'twitter', type: 'main' };
    }

    const handle = Twitter.extractHandle(url);
    if (handle) {
      return { name: 'twitter', type: 'handle', handle: handle };
    }

    return { name: 'unknown' };
  }
}
