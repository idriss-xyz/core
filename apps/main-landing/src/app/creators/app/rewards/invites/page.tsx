import AvailableRewardsCard from './available-rewards';

// ts-unused-exports:disable-next-line
export default function InvitesPage() {
  const { availableRewards } = { availableRewards: 32 }; // TODO: Hook to data (useRewards)
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <AvailableRewardsCard availableRewards={availableRewards} />
      </div>
    </div>
  );
}
