export interface FollowedChannel {
  broadcasterId: string;
  login: string;
  name: string;
  profileImage: string;
  followers: number;
  followedAt: string;
  game: { name: string; url: string } | null;
}
// ts-unused-exports:disable-next-line
export interface InvitedStreamersData {
  displayName: string;
  profilePictureUrl: string;
  numberOfFollowers: number;
  joinDate: Date;
  streamStatus: boolean;
  game: { name: string; url: string } | null;
}
