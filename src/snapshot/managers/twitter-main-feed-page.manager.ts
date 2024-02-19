import { ServiceWorkerCommandBus } from '../../infrastructure/command-bus';
import { GetProposalsCommand } from '../commands';
import { Proposal } from '../types';
import { getSnapshotFromTwitterHandle } from '../utils';
import { TwitterWidget } from '../widgets';

export class TwitterMainFeedPageManager {
  private widgets: TwitterWidget[] = [];
  private fetchedSnapshotNames: string[] = [];
  private isLoading: boolean = false;

  clear() {
    this.widgets.forEach((widget) => {
      widget.remove();
    });

    this.widgets = [];
    this.fetchedSnapshotNames = [];
    this.isLoading = false;
  }

  async run() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    const usernameNodes =
      Array.from(document.querySelectorAll('[data-testid="User-Name"]')) ?? [];

    const toBeInjected = usernameNodes
      .map((node) => {
        const anchor = node.querySelector('a');

        if (!anchor) {
          return undefined;
        }
        const anchorRect = anchor.getBoundingClientRect();

        // for some reason there are some tweets that are not visible on the screen
        if (anchorRect.height === 0) {
          return undefined;
        }

        const handle = anchor.getAttribute('href')?.replace('/', '');
        if (!handle) {
          return undefined;
        }
        const snapshotName = getSnapshotFromTwitterHandle(handle);
        if (!snapshotName) {
          return undefined;
        }

        const wasAlreadyFetched =
          this.fetchedSnapshotNames.includes(snapshotName);

        if (wasAlreadyFetched) {
          return undefined;
        }

        return {
          snapshotName,
          top: anchorRect.top + window.scrollY,
        };
      })
      .filter(Boolean);

    if (toBeInjected.length === 0) {
      this.isLoading = false;
      return;
    }

    const snapshotNamesToFetch = [
      ...new Set(toBeInjected.map((snapshot) => snapshot.snapshotName)),
    ];

    this.fetchedSnapshotNames = [
      ...this.fetchedSnapshotNames,
      ...snapshotNamesToFetch,
    ];
    const proposals = await ServiceWorkerCommandBus.invoke<Proposal[]>(
      new GetProposalsCommand({ snapshotNames: snapshotNamesToFetch }),
    );

    for (const proposal of proposals) {
      const top = toBeInjected.find(({ snapshotName }) => {
        return snapshotName === proposal.space.id;
      })?.top;

      if (top === undefined) {
        throw new Error('Expected top value');
      }

      const widgetForThisSnapshotWasAlreadyRendered = this.widgets.some(
        (widget) => widget.snapshotName === proposal.space.id,
      );

      if (widgetForThisSnapshotWasAlreadyRendered) {
        continue;
      }

      this.widgets.push(
        TwitterWidget.create({
          position: {
            x: 16,
            y: top - 12, // 12 is top padding of the tweet
          },
          isFixed: false,
          proposal: proposal,
          snapshotName: proposal.space.id,
        }),
      );
    }
    this.isLoading = false;
  }
}
