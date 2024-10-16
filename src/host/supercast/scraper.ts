import {
  ExternalLinksScrapingResult,
  PostScrapingResult,
  UserScrapingResult,
} from 'shared/scraping';

import { extractUsernameFromPathname, isUserPathname } from './utils';

export class Scraper {
  public static getExternalLinks(): ExternalLinksScrapingResult[] {
    // not used for now
    return [];
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
      usernameNode?.parentElement?.firstElementChild?.firstElementChild ??
      usernameNode?.parentElement?.parentElement?.parentElement
        ?.firstElementChild?.firstElementChild;
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

  private static getConversationPanel() {
    return document.querySelector('aside');
  }

  public static getPosts(): PostScrapingResult[] {
    const main = Scraper.getMain();
    const conversationPanel = Scraper.getConversationPanel();
    if (!main && !conversationPanel) {
      return [];
    }
    const mainPosts = main?.querySelectorAll(':scope ul > li') ?? [];
    const conversationPosts =
      conversationPanel?.querySelectorAll(':scope ul > li') ?? [];
    const conversationRepliesPosts =
      conversationPanel?.querySelectorAll(':scope ul > div > li') ?? [];

    const posts = [
      ...mainPosts,
      ...conversationPosts,
      ...conversationRepliesPosts,
    ];

    return posts
      .map((post) => {
        const links = [...post.querySelectorAll('a')];
        const username = links
          .find((link) => {
            return link.href.length > 0;
          })
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

  public static getUsers(): UserScrapingResult[] {
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
            const userFullNameNode = link.querySelector(':scope > span');
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

    const handleUser = Scraper.getHandleUser();

    if (handleUser) {
      return [...usersFromPosts, handleUser];
    }

    return usersFromPosts;
  }
}
