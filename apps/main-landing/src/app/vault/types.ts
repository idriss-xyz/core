type ClaimedEvent = {
  to: string;
  total: string;
  bonus: boolean;
};

export type ClaimedEventsResponse = {
  events: ClaimedEvent[];
  lastProcessedBlock: string;
};
