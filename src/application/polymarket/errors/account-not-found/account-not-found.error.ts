export class AccountNotFoundError extends Error {
  constructor(message = 'Polymarket account not found.') {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
