import {
  ExternalLinksScrapingResult,
  PostScrapingResult,
  UserScrapingResult,
} from 'shared/scraping';

import { extractUsernameFromPathname, isUserPathname } from './utils';

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

  /** Array of aside elements where index 0 is left aside and index 1 is right aside (can get changed if Warpcast modifies their UI) */
  private static getAsides() {
    return [...document.querySelectorAll('aside')];
  }

  private static getRightAside() {
    return Scraper.getAsides()[1];
  }

  private static getRightAsideSections() {
    const rightAside = Scraper.getRightAside();
    if (!rightAside) {
      return [];
    }
    return [...rightAside.querySelectorAll(':scope > div')];
  }

  private static getSuggestedFollowsSection() {
    const sections = Scraper.getRightAsideSections();
    return sections.find((section) => {
      const title = section.querySelector(':scope > div');
      if (!title) {
        return false;
      }
      return title.textContent === 'Suggested Follows';
    });
  }

  private static getSuggestedFollowsSectionUsers(): UserScrapingResult[] {
    const suggestedFollowSection = Scraper.getSuggestedFollowsSection();
    if (!suggestedFollowSection) {
      return [];
    }

    const links = [...suggestedFollowSection.querySelectorAll('a')];
    return links
      .map((link) => {
        const userNode = link.parentElement;
        if (link.textContent === 'Show more' || !userNode) {
          return;
        }
        const userFullNameNode = userNode.querySelector(
          ':scope > div > div > span',
        );
        const username = link.href.split('/').at(-1);

        if (!userFullNameNode?.parentElement || !username) {
          return;
        }

        const rect = userFullNameNode.getBoundingClientRect();

        return {
          node: userFullNameNode.parentElement,
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  private static getMain() {
    return document.querySelector('main');
  }

  private static getHandleUser(): UserScrapingResult | undefined {
    const pathname = window.location.pathname;
    if (!isUserPathname(pathname)) {
      return;
    }
    const username = extractUsernameFromPathname(pathname);
    const main = Scraper.getMain();
    if (!main || !username) {
      return;
    }
    const allDivsOfMain = [...main.querySelectorAll('div')];
    const usernameNode = allDivsOfMain.find((div) => {
      return div.textContent === `@${username}`;
    });
    const userFullNameNode =
      usernameNode?.parentElement?.firstElementChild?.firstElementChild;
    if (!userFullNameNode?.parentElement) {
      return;
    }

    const rect = userFullNameNode.getBoundingClientRect();

    return {
      node: userFullNameNode.parentElement,
      top: rect.top + window.scrollY,
      data: {
        username,
      },
    };
  }

  public static getUsers(): UserScrapingResult[] {
    Scraper.getHandleUser();
    const posts = Scraper.getPosts();
    const usersFromPosts = posts
      .map((post) => {
        const links = [...post.node.querySelectorAll('a')];
        const userFullName = links
          .map((link) => {
            const isUserLink = link.href.endsWith(post.data.authorUsername);
            if (!isUserLink) {
              return;
            }
            const userFullNameNode = link.querySelector(':scope > div > span');
            if (!userFullNameNode?.parentElement) {
              return;
            }

            const rect = userFullNameNode.getBoundingClientRect();

            return {
              node: userFullNameNode.parentElement,
              top: rect.top + window.scrollY,
              data: {
                username: post.data.authorUsername,
              },
            };
          })
          .find(Boolean);

        return userFullName;
      })
      .filter(Boolean);

    const usersFromSuggestedFollow = Scraper.getSuggestedFollowsSectionUsers();
    const handleUser = Scraper.getHandleUser();

    if (handleUser) {
      return [...usersFromPosts, ...usersFromSuggestedFollow, handleUser];
    }

    return [...usersFromPosts, ...usersFromSuggestedFollow];
  }
}
