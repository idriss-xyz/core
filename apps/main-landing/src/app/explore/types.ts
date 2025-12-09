export type HubStreamerUser = {
  id: string;
  name: string;
  profilePictureUrl: string;
  description?: string;
  donationLink: string;
  languages?: string;
  filters?: string;
  stats?: { followers?: string };
};

export type HubStreamer = {
  header: string;
  users: HubStreamerUser[];
};
