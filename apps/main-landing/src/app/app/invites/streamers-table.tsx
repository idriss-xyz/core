'use client';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { TabItem, TabsPill } from '@idriss-xyz/ui/tabs-pill';
import { Badge } from '@idriss-xyz/ui/badge';
import { formatFollowerCount } from '@idriss-xyz/utils';

import { TimeAgoCell } from '@/app/components/time-ago-cell';
import { Avatar } from '@/app/components/avatar/avatar';
import { PillLabel } from '@/app/components/pill-label';
import { gameLogoMap } from '@/app/constants';
import { CopyButton } from '@/app/components/copy-button/copy-button';
import { useAuth } from '@/app/context/auth-context';

interface Streamer {
  id: string;
  name: string;
  profilePictureUrl: string;
  streamStatus: boolean;
  followers: number;
  reward: number;
  joined?: string;
  games: string[];
}

// ---------- props ----------
type Properties = {
  invited: {
    displayName: string;
    profilePictureUrl: string;
    numberOfFollowers: number;
    joinDate: string;
    streamStatus: boolean;
  }[];
  suggested: {
    displayName: string;
    profilePictureUrl: string;
    numberOfFollowers: number;
    joinDate: string;
    streamStatus: boolean;
  }[];
};

const columns: ColumnDefinition<Streamer>[] = [
  {
    id: 'rank',
    name: '#',
    accessor: (_, index) => {
      return index + 1;
    },
    className: 'w-[40px] text-right',
  },
  {
    id: 'name',
    name: 'Name',
    accessor: (item) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar src={item.profilePictureUrl} size={32} />
          <span className="text-body4">
            <a
              href={`https://twitch.tv/${item.name}`}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
            </a>
          </span>
          {item.streamStatus && (
            <Badge type="danger" variant="solid">
              Live
            </Badge>
          )}
        </div>
      );
    },
    sortable: false,
    className: 'flex items-center gap-x-1.5 overflow-hidden',
  },
  {
    id: 'followers',
    name: 'Followers',
    accessor: (item) => {
      return formatFollowerCount(item.followers);
    },
    sortable: true,
    sortFunction: (a, b) => {
      return a.followers - b.followers;
    },
  },
  {
    id: 'joined',
    name: 'Joined',
    accessor: (item) => {
      return <TimeAgoCell timestamp={item.joined} />;
    },
    sortable: true,
    sortFunction: (a, b) => {
      return (
        new Date(a.joined ?? '1970-01-01').getTime() -
        new Date(b.joined ?? '1970-01-01').getTime()
      );
    },
  },
  {
    id: 'games',
    name: 'Games',
    accessor: (item) => {
      return (
        <div className="flex flex-wrap gap-1.5">
          {item.games.map((game) => {
            return (
              <PillLabel
                key={game}
                option={{ label: game }}
                className="w-fit border-neutral-300"
              >
                <div className="flex items-center gap-1.5">
                  {gameLogoMap[game] && (
                    <img
                      src={gameLogoMap[game]}
                      alt={`${game} logo`}
                      className="size-4"
                    />
                  )}
                  {game}
                </div>
              </PillLabel>
            );
          })}
        </div>
      );
    },
    sortable: false,
  },
];

const MAX_ROWS_BEFORE_SCROLL = 10;

export default function StreamersTable({
  invited = [],
  suggested = [],
}: Properties) {
  const { creator } = useAuth(); // ← current user info (for invite URL)
  /* helper to convert API user → table row */
  const mapToRows = (array: Properties['invited']): Streamer[] => {
    return array.map((u, index) => {
      return {
        id: index.toString(),
        name: u.displayName,
        profilePictureUrl: u.profilePictureUrl,
        streamStatus: u.streamStatus ?? false,
        followers: u.numberOfFollowers,
        reward: 0,
        joined: u.joinDate,
        games: [], // backend not implemented yet
      };
    });
  };

  const [activeTab, setActiveTab] = useState<'Suggested' | 'Invited'>(
    'Suggested',
  );

  const rows =
    activeTab === 'Suggested' ? mapToRows(suggested) : mapToRows(invited);

  const emptyState = (
    <div className="mx-auto flex min-h-[200px] w-full flex-col items-center justify-center gap-4">
      <span className="text-center text-heading6 uppercase text-neutral-900">
        No streamers yet
      </span>
      <span className="mx-8 text-center text-display5 uppercase gradient-text">
        SHARE YOUR LINK
        <br />
        TO INVITE FRIENDS
      </span>
      <CopyButton
        text={`https://idriss.xyz/invite/${creator?.name}`}
        disabled={!creator}
      />
    </div>
  );
  const table = (
    <Table
      columns={columns}
      data={rows}
      keyExtractor={(item) => {
        return item.id;
      }}
      emptyState={emptyState}
      className="w-full table-fixed text-neutral-900"
    />
  );

  const streamersTableTabs: TabItem[] = [
    {
      name: 'Suggested',
      href: '#',
      iconName: 'Users2',
      isActive: activeTab === 'Suggested',
      onClick: () => {
        return setActiveTab('Suggested');
      },
    },
    {
      name: 'Invited',
      href: '#',
      iconName: 'MailCheck',
      isActive: activeTab === 'Invited',
      onClick: () => {
        return setActiveTab('Invited');
      },
    },
  ];
  return (
    <Card className="col-span-3 p-0">
      <CardHeader className="flex items-center gap-[10px] p-3">
        <span className="text-label3 text-neutral-900">Streamers</span>
        <TabsPill tabs={streamersTableTabs} />
      </CardHeader>
      <CardBody className="p-0">
        {rows.length > MAX_ROWS_BEFORE_SCROLL ? (
          <ScrollArea className="max-h-[520px]">{table}</ScrollArea>
        ) : (
          table
        )}
      </CardBody>
    </Card>
  );
}
