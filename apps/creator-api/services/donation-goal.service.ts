import { DonationGoal, AppDataSource, DonationGoalView } from '@idriss-xyz/db';
import { Repository } from 'typeorm';

class DonationGoalService {
  private donationGoalViewRepository: Repository<DonationGoalView> =
    AppDataSource.getRepository(DonationGoalView);
  private donationGoalRepository: Repository<DonationGoal> =
    AppDataSource.getRepository(DonationGoal);

  async getDonationGoalsByCreatorName(creatorName: string) {
    return this.donationGoalViewRepository.find({
      where: { creatorName, deleted: false },
      order: {
        active: 'DESC', // Active goals first
        endDate: 'DESC', // Most recent goals next
      },
    });
  }

  async getActiveDonationGoalByCreatorName(creatorName: string) {
    return this.donationGoalViewRepository.findOne({
      where: {
        creatorName,
        active: true,
      },
    });
  }

  async getActiveGoalByCreatorId(
    creatorId: number,
  ): Promise<DonationGoal | null> {
    return this.donationGoalRepository.findOne({
      where: {
        creator: { id: creatorId },
        active: true,
      },
      relations: ['creator'],
    });
  }

  async createDonationGoal(donationGoal: DonationGoal) {
    // If this is an active goal, deactivate any other active goals for this creator
    if (donationGoal.active) {
      await this.deactivateCreatorGoals(donationGoal.creator.id);
    }

    const saved = await this.donationGoalRepository.save(donationGoal);

    return saved;
  }

  async activateGoal(goalId: number): Promise<DonationGoal> {
    const goal = await this.donationGoalRepository.findOne({
      where: { id: goalId },
      relations: ['creator'],
    });

    if (!goal) {
      throw new Error(`Donation goal with ID ${goalId} not found`);
    }

    // Deactivate other goals for this creator
    await this.deactivateCreatorGoals(goal.creator.id);

    // Activate this goal
    goal.active = true;
    const savedGoal = await this.donationGoalRepository.save(goal);

    return savedGoal;
  }

  async deactivateGoal(goalId: number): Promise<DonationGoal> {
    const goal = await this.donationGoalRepository.findOne({
      where: { id: goalId },
      relations: ['creator'],
    });

    if (!goal) {
      throw new Error(`Donation goal with ID ${goalId} not found`);
    }

    goal.active = false;
    return this.donationGoalRepository.save(goal);
  }

  async deleteDonationGoal(goalId: number): Promise<void> {
    const goal = await this.donationGoalRepository.findOne({
      where: { id: goalId },
    });

    if (!goal) {
      throw new Error(`Donation goal with ID ${goalId} not found`);
    }

    await this.donationGoalRepository.save({ ...goal, deleted: true });
  }

  private async deactivateCreatorGoals(creatorId: number): Promise<void> {
    await this.donationGoalRepository
      .createQueryBuilder()
      .update(DonationGoal)
      .set({ active: false })
      .where('creator_id = :creatorId AND active = true', { creatorId })
      .execute();
  }
}
// Export a singleton instance
export const donationGoalService = new DonationGoalService();
