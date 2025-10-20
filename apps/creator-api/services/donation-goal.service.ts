import { AppDataSource } from '../db/database';
import { DonationGoal } from '../db/entities';
import { DonationGoalView } from '../db/views';

class DonationGoalService {
  private donationGoalViewRepository =
    AppDataSource.getRepository(DonationGoalView);
  private donationGoalRepository = AppDataSource.getRepository(DonationGoal);

  async getDonationGoalsByCreatorName(creatorName: string) {
    return this.donationGoalViewRepository.findOne({
      where: { creatorName },
    });
  }

  async createDonationGoal(donationGoal: DonationGoal) {
    return this.donationGoalRepository.save(donationGoal);
  }
}
// Export a singleton instance
export const donationGoalService = new DonationGoalService();
