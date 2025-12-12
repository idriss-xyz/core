export type HubStreamerUser = {
  id: string;
  name: string;
  profilePictureUrl: string;
  description?: string;
  /* one of the two links is required */
  followLink?: string;
  donationLink?: string;
  languages?: string;
  filters?: string;
  stats?: { followers?: string };
  featured?: boolean;
};

export type HubStreamer = {
  header: string;
  users: HubStreamerUser[];
};
