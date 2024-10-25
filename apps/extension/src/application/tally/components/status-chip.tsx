import { Chip, classes } from 'shared/ui';

const getVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': {
      return 'positive';
    }
    case 'defeated': {
      return 'negative';
    }
    default: {
      return 'default';
    }
  }
};

export const StatusChip = ({ status }: { status: string }) => {
  const chipVariant = getVariant(status);
  return (
    <Chip
      className={classes(
        'rounded-sm border-tally-border-primary px-[4px] py-0.5 font-bold uppercase tracking-wide',
        {
          'bg-tally-purple-100 text-tally-purple-500':
            chipVariant === 'positive',
          'bg-tally-red-100 text-tally-red-500': chipVariant === 'negative',
          'bg-tally-teal-50 text-tally-teal-600': chipVariant === 'default',
        },
      )}
    >
      {status}
    </Chip>
  );
};
