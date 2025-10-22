import { AppDataSource } from '../db/database';
import { DonationGoal, Creator, Donation } from '../db/entities';
import { DonationGoalView } from '../db/views';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

class DonationGoalService {
  private donationGoalViewRepository: Repository<DonationGoalView> =
    AppDataSource.getRepository(DonationGoalView);
  private donationGoalRepository: Repository<DonationGoal> =
    AppDataSource.getRepository(DonationGoal);
  private donationRepository: Repository<Donation> =
    AppDataSource.getRepository(Donation);
  private creatorRepository: Repository<Creator> =
    AppDataSource.getRepository(Creator);

  async getDonationGoalsByCreatorName(creatorName: string) {
    return this.donationGoalViewRepository.find({
      where: { creatorName },
      order: {
        active: 'DESC', // Active goals first
        endDate: 'DESC', // Most recent goals next
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

    // Associate existing donations that fall within the goal's timeframe
    if (donationGoal.active) {
      await this.associateExistingDonations(saved);
    }

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

    // Associate existing donations that fall within the goal's timeframe
    await this.associateExistingDonations(savedGoal);

    return savedGoal;
  }

  async deactivateGoal(goalId: number): Promise<DonationGoal> {
    const goal = await this.donationGoalRepository.findOne({
      where: { id: goalId },
    });

    if (!goal) {
      throw new Error(`Donation goal with ID ${goalId} not found`);
    }

    goal.active = false;
    return this.donationGoalRepository.save(goal);
  }

  private async deactivateCreatorGoals(creatorId: number): Promise<void> {
    await this.donationGoalRepository
      .createQueryBuilder()
      .update(DonationGoal)
      .set({ active: false })
      .where('creator_id = :creatorId AND active = true', { creatorId })
      .execute();
  }

  private async associateExistingDonations(goal: DonationGoal): Promise<void> {
    // Get all creator addresses
    const creator = await this.creatorRepository.findOne({
      where: { id: goal.creator.id },
      relations: ['addresses'],
    });

    if (!creator || !creator.addresses || creator.addresses.length === 0) {
      return;
    }

    const creatorAddresses = creator.addresses.map((addr) => addr.address);

    // Find all donations to this creator within the goal's timeframe
    // that don't already have a goal assigned
    await this.donationRepository
      .createQueryBuilder()
      .update(Donation)
      .set({ donationGoal: goal })
      .where(
        `
        to_address IN (:...creatorAddresses) AND
        donation_goal_id IS NULL AND
        timestamp >= :startDate AND
        timestamp <= :endDate
      `,
        {
          creatorAddresses,
          startDate: goal.startDate,
          endDate: goal.endDate,
        },
      )
      .execute();
  }
}
// Export a singleton instance
export const donationGoalService = new DonationGoalService();
