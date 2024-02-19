import { createElement } from '../../lib/dom';
import { Proposal } from '../types';
import {
  getDaysUntil,
  getEndsInLabel,
  getProposalUrl,
  getUserUrl,
} from '../utils';

import { styles } from './styles';

type Point = {
  x: number;
  y: number;
};

type CreateWidgetProps = {
  position: Point;
  isFixed: boolean;
  proposal: Proposal;
  snapshotName: string;
};

export class TwitterWidget {
  private widgetRoot: HTMLDivElement;
  private shadowRoot: ShadowRoot;
  private widgetContainer: HTMLDivElement;
  private contentContainer: HTMLDivElement;
  private proposal: Proposal;
  public snapshotName: string;

  private constructor(props: CreateWidgetProps) {
    this.snapshotName = props.snapshotName;
    this.proposal = props.proposal;

    this.widgetRoot = document.createElement('div');
    this.shadowRoot = this.widgetRoot.attachShadow({ mode: 'open' });
    this.widgetContainer = createElement('div', {
      style: styles.getWidgetContainer(
        props.position.x,
        props.position.y,
        props.isFixed,
      ),
    });
    this.contentContainer = createElement('div', {
      style: styles.getWidgetContent(),
    });
  }

  static create(props: CreateWidgetProps) {
    const widget = new TwitterWidget(props);
    widget.render();
    return widget;
  }

  private render() {
    const header = createElement('div', {
      style: styles.getHeader(),
    });

    const author = createElement('a', {
      style: styles.getAuthor(),
      textContent: this.proposal.author.resolvedAddress
        ? `By ${this.proposal.author.resolvedAddress}`
        : `By ${this.proposal.author.address.substring(0, 6)}...${this.proposal.author.address.substring(this.proposal.author.address.length - 4)}`,
      href: getUserUrl(this.proposal.author.address),
      target: '_blank',
      rel: 'noopener noreferrer',
    });

    const statusBadge = createElement('div', {
      style: styles.getStatusBadge(),
      textContent: 'Active',
    });

    header.appendChild(author);
    header.appendChild(statusBadge);

    const main = createElement('div', {
      style: styles.getMainContainer(),
    });

    const title = createElement('div', {
      style: styles.getTitle(),
      textContent: this.proposal.title,
    });

    const description = createElement('div', {
      textContent: `${this.proposal.body.substring(0, 120)}...`,
      style: styles.getDescription(),
    });

    main.appendChild(title);
    main.appendChild(description);

    const footer = createElement('div', {
      style: styles.getFooter(),
    });

    const endsIn = createElement('div', {
      style: styles.getEndsIn(),
      textContent: getEndsInLabel(getDaysUntil(this.proposal.end * 1000)),
    });

    const visitProposalButton = createElement('a', {
      rel: 'noopener noreferrer',
      href: getProposalUrl(this.snapshotName, this.proposal.id),
      style: styles.getButton(),
      target: '_blank',
      textContent: 'Vote',
    });

    footer.appendChild(endsIn);
    footer.appendChild(visitProposalButton);

    const closeButton = createElement('button', {
      textContent: 'x',
      style: styles.getCloseButton(),
    });
    closeButton.addEventListener('click', () => this.hide());

    this.contentContainer.appendChild(closeButton);
    this.contentContainer.appendChild(header);
    this.contentContainer.appendChild(main);
    this.contentContainer.appendChild(footer);

    this.widgetContainer.appendChild(this.contentContainer);

    this.shadowRoot.appendChild(this.widgetContainer);
    document.body.appendChild(this.widgetRoot);
  }

  hide() {
    this.contentContainer.style.display = 'none';
  }

  remove() {
    this.widgetRoot.remove();
  }
}
