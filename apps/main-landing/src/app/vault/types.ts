type ClaimedEvent = {
  to: string;
  total: string;
  bonus: boolean;
  transactionHash: string;
};

export type ClaimedEventsResponse = {
  events: ClaimedEvent[];
  lastProcessedBlock: string;
};
