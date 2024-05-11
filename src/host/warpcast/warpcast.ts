export class Warpcast {
  private static EXTERNAL_LINK_NODE_SELECTOR = 'a';

  public static getExternalLinksNodes(): Element[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, unicorn/prefer-spread, prettier/prettier
    return Array.from(document.querySelectorAll(this.EXTERNAL_LINK_NODE_SELECTOR)) ?? [];
  }
}
