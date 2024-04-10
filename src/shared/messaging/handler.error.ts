export class HandlerError extends Error {
  constructor(message = 'Something went wrong') {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
