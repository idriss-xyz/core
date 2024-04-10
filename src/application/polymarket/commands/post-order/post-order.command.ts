import { Command } from 'shared/messaging';

import { PostOrderCommandDetails } from './post-order.types';

export class PostOrderCommand extends Command<PostOrderCommandDetails> {
  public readonly name = 'PostOrderCommand' as const;
  public id: string;

  constructor(public details: PostOrderCommandDetails) {
    super();
    this.id = this.name;
  }
}
