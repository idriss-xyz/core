import { CommandBus } from '../../command-bus';
import { extractTwitterHandle } from '../../ts-utils';
import { GetProposalCommand } from '../commands';
import { Proposal } from '../types';
import { getSnapshotFromTwitterHandle } from '../utils';
import { TwitterWidget } from '../widgets/twitter';

export class TwitterHandlePageManager {
  private currentHandle: string | undefined = undefined;
  private widget: TwitterWidget | undefined = undefined;
  private isLoading: boolean = false;

  clear() {
    this.widget?.remove();
    this.widget = undefined;
    this.currentHandle = undefined;
    this.isLoading = false;
  }

  async run() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    const handle = extractTwitterHandle(window.location.href);
    if (!handle || handle === this.currentHandle) {
      return;
    }

    this.clear();
    this.currentHandle = handle;

    const snapshotName = getSnapshotFromTwitterHandle(handle);
    if (!snapshotName) {
      return;
    }

    const proposal = await CommandBus.invoke<Proposal>(
      new GetProposalCommand({ snapshotName }),
    );

    if (!proposal) {
      this.isLoading = false;
      return;
    }

    this.widget = TwitterWidget.create({
      position: {
        x: 16,
        y: 80,
      },
      isFixed: true,
      proposal,
      snapshotName: proposal.space.id,
    });
    this.isLoading = false;
  }
}
