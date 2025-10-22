export interface CommandResponse<ExpectedResponse> {
  response: ExpectedResponse;
  commandId: string;
}

export interface SerializedCommand<Payload> {
  id: string;
  name: string;
  payload: Payload;
}
