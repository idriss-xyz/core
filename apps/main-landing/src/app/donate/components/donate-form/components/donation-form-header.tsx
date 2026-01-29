import { Badge } from '@idriss-xyz/ui/badge';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { useState } from 'react';

import { CreatorProfile } from '../../../types';

type Properties = {
  creatorInfo: CreatorProfile;
};

export function DonateFormHeader({ creatorInfo }: Properties) {
  const [imageError, setImageError] = useState(false);

  return (
    <h1 className={classes('mb-6 self-start text-heading4')}>
      {creatorInfo.name
        ? `Donate to ${creatorInfo.name}`
        : 'Select your donation details'}
      {imageError || !creatorInfo.profilePictureUrl ? (
        <div className="ml-3 inline-flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
          <Icon size={20} name="CircleUserRound" className="text-neutral-500" />
        </div>
      ) : (
        <img
          src={creatorInfo.profilePictureUrl}
          key={creatorInfo.profilePictureUrl}
          className="ml-3 inline h-8 rounded-full"
          alt=""
          onError={() => {
            return setImageError(true);
          }}
        />
      )}

      {creatorInfo.streamStatus && (
        <Badge type="danger" variant="solid" className="ml-3">
          Live
        </Badge>
      )}
    </h1>
  );
}
