import { CustomError } from 'ts-custom-error';

export class HandlerError extends CustomError {
  constructor(message = 'Something went wrong') {
    super(message);
  }
}

export class HandlerResponseError extends CustomError {
  constructor(
    public commandName: string,
    public response: string,
    public statusCode: number,
  ) {
    super(`${commandName} HandlerResponseError`);
  }
}
