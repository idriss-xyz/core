import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';
import { CreatorProfileView } from '../db/views';
import {
  fetchTwitchUserInfo,
  fetchTwitchStreamStatus,
} from '../utils/twitch-api';

export interface EnrichedCreatorProfile extends CreatorProfileView {
  streamStatus?: boolean;
}

export class CreatorProfileService {
  private profileRepository = AppDataSource.getRepository(CreatorProfileView);
  private creatorRepository = AppDataSource.getRepository(Creator);

  async getProfileByName(name: string): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({ where: { name } });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  async getProfileById(id: number): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  async getProfileByAddress(
    address: string,
  ): Promise<EnrichedCreatorProfile | null> {
    const profile = await this.profileRepository.findOne({
      where: { address },
    });
    if (!profile) return null;
    return this.enrichWithTwitchData(profile);
  }

  private async enrichWithTwitchData(
    profile: CreatorProfileView,
  ): Promise<EnrichedCreatorProfile> {
    if (!profile.oauthAccountId) {
      return profile;
    }

    try {
      const [streamInfo, userInfo] = await Promise.all([
        fetchTwitchStreamStatus(profile.oauthAccountId),
        fetchTwitchUserInfo(profile.oauthAccountId),
      ]);

      if (
        userInfo?.profile_image_url &&
        userInfo.profile_image_url !== profile.profilePictureUrl
      ) {
        await this.updateProfilePicture(profile.id, userInfo.profile_image_url);
        profile.profilePictureUrl = userInfo.profile_image_url;
      }

      return {
        ...profile,
        streamStatus: streamInfo.isLive,
      };
    } catch (error) {
      console.error('Error enriching profile with Twitch data:', error);
      return profile;
    }
  }

  // Update profile picture if it has changed
  private async updateProfilePicture(
    creatorId: number,
    profilePictureUrl: string,
  ): Promise<void> {
    try {
      await this.creatorRepository.update(
        { id: creatorId },
        { profilePictureUrl },
      );
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  }
}

// Export a singleton instance
export const creatorProfileService = new CreatorProfileService();
