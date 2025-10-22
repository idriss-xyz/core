import { CustomError } from 'ts-custom-error';

export class HandlerError extends CustomError {
  constructor(message = 'Something went wrong') {
    super(message);
  }
}
