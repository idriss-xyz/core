import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import Image from 'next/image';

// ts-unused-exports:disable-next-line
export default function SuccessfulInvitesCard({
  successfulInvites,
  successfulInvitesUsers,
}: {
  successfulInvites: number;
  successfulInvitesUsers: { profilePictureUrl: string; displayName: string }[];
}) {
  return (
    <Card className="col-span-1">
      <div className="flex flex-col gap-6">
        <CardHeader className="text-label3 text-neutral-900">
          Successful invites
        </CardHeader>
        <CardBody className="flex grow items-center">
          <div className="flex gap-[70px]">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-label1 text-black">
                <Icon name="Users2" className="text-mint-600" size={16} />
                {successfulInvites}
              </span>
              <span className="text-body4 text-neutral-600">
                Joined via your link
              </span>
            </div>

            {successfulInvitesUsers.length > 0 && (
              <div className="flex -space-x-6">
                {successfulInvitesUsers.slice(0, 6).map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="relative size-12 overflow-hidden rounded-full border-[3px] border-white"
                      style={{ zIndex: 6 + index }}
                    >
                      <Image
                        src={user.profilePictureUrl}
                        alt={user.displayName}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardBody>
      </div>
    </Card>
  );
}
