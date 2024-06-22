export interface MonitoringEvent {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any; // TODO: type it
}

export interface ExceptionEvent {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any; // TODO: type it
}
