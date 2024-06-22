import { ScrapingResult } from 'shared/scraping';

export class Twitter {
  private static USERNAME_NODE_SELECTOR_2 =
    'div.r-dnmrzs.r-1ny4l3l, .r-gtdqiz .css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci, .css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci';
  private static TWEET_AUTHOR_SELECTOR = '[data-testid="User-Name"]';
  private static EXTERNAL_LINK_NODE_SELECTOR = 'a[href^="https://t.co"]';

  public static getExternalLinks(): ScrapingResult[] {
    const externalLinkNodes = [
      ...document.querySelectorAll(Twitter.EXTERNAL_LINK_NODE_SELECTOR),
    ];
    return externalLinkNodes
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

  public static getTweetAuthors(): ScrapingResult[] {
    const tweetAuthorsNodes = [
      ...document.querySelectorAll(Twitter.TWEET_AUTHOR_SELECTOR),
    ];

    return tweetAuthorsNodes
      .map((node) => {
        const linkNode = node.querySelector('a');

        if (!linkNode) {
          return;
        }

        const username = linkNode.getAttribute('href')?.replace('/', '');
        if (!username) {
          return;
        }

        const linkNodeRect = linkNode.getBoundingClientRect();
        if (!linkNodeRect.height) {
          return;
        }

        return {
          node,
          value: username,
          top: linkNodeRect.top + window.scrollY,
        };
      })
      .filter(Boolean);
  }

  private static findUsernameElement(element: Element) {
    const usernameElement = [
      ...element.querySelectorAll(
        '.r-9ilb82, .r-14j79pv, .r-rjixqe, .r-1b43r93.r-hjklzo',
      ),
    ].find((element) => {
      const textContent = element.textContent;
      return textContent?.startsWith('@');
    });

    if (!usernameElement?.textContent) {
      return;
    }

    return {
      element: usernameElement,
      username: usernameElement.textContent.replace('@', ''),
    };
  }

  public static getUsers(): ScrapingResult[] {
    const userBarElements = [
      ...document.querySelectorAll(Twitter.USERNAME_NODE_SELECTOR_2),
    ];

    const users: ScrapingResult[] = [];

    for (const userBarElement of userBarElements) {
      const usernameElement = Twitter.findUsernameElement(userBarElement);
      if (!usernameElement) {
        continue;
      }
      const { height, top } = usernameElement.element.getBoundingClientRect();

      if (!height) {
        continue;
      }

      const calculatedTop = top + window.scrollY;

      if (
        users.some((user) => {
          return (
            user.top === calculatedTop &&
            user.value === usernameElement.username
          );
        })
      ) {
        continue;
      }

      users.push({
        node: userBarElement,
        value: usernameElement.username,
        top: top + window.scrollY,
      });
    }

    return users;
  }
}
