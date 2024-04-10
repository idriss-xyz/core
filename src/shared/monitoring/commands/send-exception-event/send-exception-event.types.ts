import { ExceptionEvent } from '../../monitoring.types';

export interface SendExceptionEventCommandDetails {
  event: ExceptionEvent;
}
