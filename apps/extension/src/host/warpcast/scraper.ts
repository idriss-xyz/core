import {
  ExternalLinksScrapingResult,
  getScrapedElementId,
  UserScrapingResult,
} from 'shared/scraping';

import { extractUsernameFromPathname, isUserPathname } from './utils';

export class Scraper {
  public static getExternalLinks(): ExternalLinksScrapingResult[] {
    const selector = 'a';
    const externalLinksNodes = [...document.querySelectorAll(selector)];

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
          nodeId: getScrapedElementId(node),
          top: top + window.scrollY,
          data: {
            link,
          },
        };
      })
      .filter(Boolean);
  }

  public static getPosts() {
    const selector = '.min-h-screen > .fade-in > div';
    const posts = [...document.querySelectorAll(selector)];

    return posts
      .map((post) => {
        const links = [
          ...post.querySelectorAll(
            String.raw`a.font-semibold.hover\:underline[data-idrissid]`,
          ),
        ];

        const usernameLinkNode = links.length > 0 ? links[0] : undefined;
        const repostUsernameLinkNode = links.length > 1 ? links[1] : undefined;

        const username = usernameLinkNode
          ?.getAttribute('href')
          ?.replace('/', '');

        if (!username || !usernameLinkNode) {
          return;
        }

        const linkNodeRect = post.getBoundingClientRect();
        if (!linkNodeRect.height) {
          return;
        }

        return {
          node: post,
          nodeId: getScrapedElementId(post),
          usernameLinkNode,
          repostUsernameLinkNode,
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

        const node = userFullNameNode.parentElement;
        node.classList.remove('space-x-2');
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');

        return {
          node,
          nodeId: getScrapedElementId(node),
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
    const pathname = globalThis.location.pathname;
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

    // traversing 2 times via parentElement is required when user is following current user as it changes DOM
    const userFullNameNode =
      usernameNode?.parentElement?.firstElementChild?.firstElementChild ??
      usernameNode?.parentElement?.parentElement?.firstElementChild
        ?.firstElementChild;
    if (!userFullNameNode?.parentElement) {
      return;
    }

    const rect = userFullNameNode.getBoundingClientRect();
    const node = userFullNameNode.parentElement;
    node.classList.remove('space-x-2');
    node.style.setProperty('display', 'inline-flex', 'important');
    node.style.setProperty('align-items', 'center', 'important');

    return {
      node,
      nodeId: getScrapedElementId(node),
      top: rect.top + window.scrollY,
      data: {
        username,
      },
    };
  }

  private static getUsersFromPosts() {
    const posts = Scraper.getPosts();
    return posts
      .map((post) => {
        const rect = post.usernameLinkNode.getBoundingClientRect();
        const node = post.usernameLinkNode.parentElement;
        if (!node) {
          return;
        }

        node.style.setProperty('display', 'inline-flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username: post.data.authorUsername,
          },
        };
      })
      .filter(Boolean);
  }

  private static getUsersFromRePosts() {
    const posts = Scraper.getPosts();
    return posts
      .map((post) => {
        if (!post.repostUsernameLinkNode) {
          return;
        }
        const username = post.repostUsernameLinkNode
          .getAttribute('href')
          ?.replace('/', '');
        const rect = post.repostUsernameLinkNode.getBoundingClientRect();
        const node = post.repostUsernameLinkNode.parentElement;
        if (!node || !username) {
          return;
        }

        // skip applying inline-flex in the notifications tab, as it leads to squashed elements
        if (!username.includes('notifications')) {
          node.style.setProperty('display', 'inline-flex', 'important');
          node.style.setProperty('align-items', 'center', 'important');
        }

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  private static getDirectCastUsersList() {
    return document.querySelector(
      String.raw`.h-\[var\(--search-for-direct-cast-targets-list-height\)\]`,
    );
  }

  private static getUsersFromDirectCastList() {
    const list = Scraper.getDirectCastUsersList();
    if (!list) {
      return [];
    }
    const usersListItem = [...list.querySelectorAll(':scope > div')];
    return usersListItem
      .map((userItem) => {
        const avatarLink = userItem.querySelector('a');
        const username = avatarLink?.getAttribute('href')?.replace('/', '');
        const container = avatarLink?.parentElement?.parentElement;
        const userFullNameNode = container?.querySelector(
          ':scope > div > div > span',
        );

        if (!userFullNameNode?.parentElement || !username) {
          return;
        }

        const rect = userFullNameNode.getBoundingClientRect();

        const node = userFullNameNode.parentElement;
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  // by meta I mean all 3 subpages - members/followers/meta
  private static getUsersFromChannelMeta() {
    const container = Scraper.getMain()?.querySelector('.fade-in');
    const userItems = [
      ...(container?.querySelectorAll(':scope > div > div > a') ?? []),
    ];

    return userItems
      .map((userItem) => {
        // workaround because this method matches also another place which is recent list of likes that user received
        if (userItem.getAttribute('title') === 'View cast') {
          return;
        }
        const username = userItem.getAttribute('href')?.replace('/', '');
        const container = userItem.parentElement;
        const userFullNameNode = container?.querySelector(
          ':scope > div > div > div > span',
        );

        if (!userFullNameNode?.parentElement || !username) {
          return;
        }

        const rect = userFullNameNode.getBoundingClientRect();

        const node = userFullNameNode.parentElement;
        node.classList.replace('space-x-2', 'space-x-0.5');
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  // by meta I mean all 3 subpages - followers-you-know/followers/following
  private static getUsersFromUserMeta() {
    const container = Scraper.getMain()?.querySelector('.fade-in');
    const userItems = [
      ...(container?.querySelectorAll(':scope > div > div > div > a') ?? []),
    ];

    return userItems
      .map((userItem) => {
        const username = userItem.getAttribute('href')?.replace('/', '');
        const container = userItem.parentElement;
        const userFullNameNode = container?.querySelector(
          ':scope > div > div > span',
        );

        if (!userFullNameNode?.parentElement || !username) {
          return;
        }

        const rect = userFullNameNode.getBoundingClientRect();

        const node = userFullNameNode.parentElement;
        node.classList.remove('space-x-2');
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  private static getUsersFromSearchResults() {
    const containers = [...document.querySelectorAll('aside .fade-in')];
    const usersListContainer = containers.find((container) => {
      const sibling = container.parentElement?.querySelector(':scope > div');
      return sibling?.textContent === 'Users';
    });
    const userItems = [
      ...(usersListContainer?.querySelectorAll(':scope > div') ?? []),
    ];
    return userItems
      .map((item) => {
        const link = item.querySelector('a');
        const username = link?.getAttribute('href')?.replace('/', '');
        const userFullNameNode = item.querySelector(':scope div > div > span');

        if (!userFullNameNode?.parentElement || !username) {
          return;
        }

        const rect = userFullNameNode.getBoundingClientRect();

        const node = userFullNameNode.parentElement;
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  private static getUsersFromDirectCastsList() {
    const container = document.querySelector('.w-full.w-max-full.fade-in');
    const userItems = [...(container?.querySelectorAll(':scope > div') ?? [])];
    return userItems
      .map((userItem) => {
        const link = userItem.querySelector('a');
        const username = link?.getAttribute('href')?.replace('/', '');
        const userFullNameNode =
          link?.parentElement?.nextSibling?.firstChild?.firstChild?.firstChild;
        if (
          !username ||
          !userFullNameNode?.parentElement ||
          !userFullNameNode ||
          userFullNameNode.childNodes.length > 1 ||
          userFullNameNode.childNodes[0]?.nodeType != 3
        ) {
          return;
        }

        const node = userFullNameNode.parentElement;
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('align-items', 'center', 'important');
        const rect = node.getBoundingClientRect();

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: rect.top + window.scrollY,
          data: {
            username,
          },
        };
      })
      .filter(Boolean);
  }

  private static getUserFromDirectCastConversation() {
    const link = Scraper.getMain()?.querySelector('nav div > span > a');
    const username = link?.getAttribute('href')?.replace('/', '');
    const userFullNameNode = link?.querySelector(':scope > span');
    if (!username || !userFullNameNode?.parentElement?.parentElement) {
      return;
    }
    const node = userFullNameNode.parentElement.parentElement;
    node.style.setProperty('display', 'flex', 'important');
    node.style.setProperty('align-items', 'center', 'important');
    node.style.setProperty('justify-items', 'center', 'important');
    const rect = node.getBoundingClientRect();

    return {
      node,
      nodeId: getScrapedElementId(node),
      top: rect.top + window.scrollY,
      data: {
        username,
      },
    };
  }

  public static getUsers(): UserScrapingResult[] {
    const usersFromPosts = Scraper.getUsersFromPosts();
    const usersFromReposts = Scraper.getUsersFromRePosts();
    const usersFromSuggestedFollow = Scraper.getSuggestedFollowsSectionUsers();
    const usersFromDirectCastList = Scraper.getUsersFromDirectCastList();
    const usersFromChannelMeta = Scraper.getUsersFromChannelMeta();
    const usersFromUserMeta = Scraper.getUsersFromUserMeta();
    const usersFromSearchResults = Scraper.getUsersFromSearchResults();
    const usersFromDirectCastsList = Scraper.getUsersFromDirectCastsList();
    const handleUser = Scraper.getHandleUser();
    const handleUsers = handleUser ? [handleUser] : [];
    const userFromDirectCastConversation =
      Scraper.getUserFromDirectCastConversation();
    const usersFromDirectCastConversation = userFromDirectCastConversation
      ? [userFromDirectCastConversation]
      : [];

    return [
      ...usersFromPosts,
      ...usersFromReposts,
      ...usersFromSuggestedFollow,
      ...usersFromDirectCastList,
      ...usersFromChannelMeta,
      ...usersFromUserMeta,
      ...usersFromSearchResults,
      ...usersFromDirectCastsList,
      ...usersFromDirectCastConversation,
      ...handleUsers,
    ];
  }
}
