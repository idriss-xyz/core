'use client';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { TabItem, TabsPill } from '@idriss-xyz/ui/tabs-pill';
import { TOKEN } from '@idriss-xyz/constants';
import Image from 'next/image';
import { Badge } from '@idriss-xyz/ui/badge';
import {
  formatFollowerCount,
  getTimeDifferenceString,
} from '@idriss-xyz/utils';

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

// TODO: Remove and use real data
const streamers: Streamer[] = [
  {
    id: '1',
    name: 'airev',
    profilePictureUrl: TOKEN.IDRISS.logo,
    streamStatus: true,
    followers: 25_400,
    reward: 60,
    joined: '2025-07-15',
    games: ['Axie Infinity', 'Ronin', 'Parallel'],
  },
  {
    id: '2',
    name: 'ramzes',
    profilePictureUrl: TOKEN.IDRISS.logo,
    streamStatus: false,
    followers: 8700,
    reward: 30,
    joined: '2025-01-10',
    games: ['Axie Infinity', 'Ronin', 'Parallel'],
  },
  {
    id: '3',
    name: 'illojuan',
    profilePictureUrl: TOKEN.IDRISS.logo,
    streamStatus: false,
    followers: 44_123,
    reward: 100,
    games: ['Parallel'],
  },
];

const columns: ColumnDefinition<Streamer>[] = [
  {
    id: 'rank',
    name: '#',
    accessor: (_, index) => {
      return index + 1;
    },
  },
  {
    id: 'name',
    name: 'Name',
    accessor: (item) => {
      return (
        <div className="flex items-center gap-2">
          <div className="relative size-8 rounded-full bg-gray-200">
            <Image
              src={item.profilePictureUrl}
              alt={item.name}
              width={32}
              height={32}
            />
          </div>
          <span className="text-body4">{item.name}</span>
          {item.streamStatus && (
            <Badge type="danger" variant="solid">
              Live
            </Badge>
          )}
        </div>
      );
    },
    sortable: false,
  },
  {
    id: 'status',
    name: 'Status',
    accessor: (item) => {
      return item.joined ? (
        <Badge type="success" variant="subtle" className="normal-case">
          Joined
        </Badge>
      ) : (
        <Badge type="info" variant="subtle" className="normal-case">
          Invite to get ${item.reward}
        </Badge>
      );
    },
    sortable: false,
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
    id: 'reward',
    name: 'Reward',
    accessor: (item) => {
      return `$${item.reward}`;
    },
    sortable: true,
    sortFunction: (a, b) => {
      return a.reward - b.reward;
    },
  },
  {
    id: 'joined',
    name: 'Joined',
    accessor: (item) => {
      return item.joined
        ? getTimeDifferenceString({
            text: 'ago',
            variant: 'short',
            timestamp: item.joined,
          })
        : null;
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
      return item.games.join(', ');
    },
    sortable: false,
  },
];

export default function StreamersTable() {
  const streamersData = {
    columns: columns,
    data: streamers,
  };
  const streamersTableTabs: TabItem[] = [
    {
      name: 'Suggested',
      href: '',
      iconName: 'Users2',
      isActive: true,
    },
    {
      name: 'Invited',
      href: '',
      iconName: 'Send',
      isActive: false,
    },
  ];
  return (
    <Card className="col-span-3 p-0">
      <CardHeader className="flex items-center gap-[10px] p-3">
        <span className="text-label3 text-neutral-900">Streamers</span>
        <TabsPill tabs={streamersTableTabs} />
      </CardHeader>
      <CardBody>
        <Table
          columns={streamersData.columns}
          data={streamersData.data}
          keyExtractor={(item) => {
            return item.id;
          }}
          className="text-neutral-900"
        />
      </CardBody>
    </Card>
  );
}
