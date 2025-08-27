'use client';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { TabItem, TabsPill } from '@idriss-xyz/ui/tabs-pill';

interface Streamer {
  id: string;
  name: string;
  status: boolean;
  followers: number;
  reward: number;
  joined: string;
  games: string[];
}

// TODO: Remove and use real data
const streamers: Streamer[] = [
  {
    id: '1',
    name: 'ShadowKnight',
    status: true,
    followers: 25_400,
    reward: 120,
    joined: '2023-01-15',
    games: ['League of Legends', 'Valorant', 'Apex Legends'],
  },
  {
    id: '2',
    name: 'LunaStar',
    status: false,
    followers: 8700,
    reward: 75,
    joined: '2022-07-30',
    games: ['Minecraft', 'Stardew Valley', 'The Sims 4'],
  },
  {
    id: '3',
    name: 'TurboGamer',
    status: true,
    followers: 44_100,
    reward: 210,
    joined: '2021-11-05',
    games: ['Fortnite', 'Call of Duty', 'Overwatch'],
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
      return item.name;
    },
  },
  {
    id: 'status',
    name: 'Status',
    accessor: (item) => {
      return item.status ? 'Joined' : `Invite to get $${item.reward}`;
    },
    sortable: false,
  },
  {
    id: 'followers',
    name: 'Followers',
    accessor: (item) => {
      return item.followers;
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
      return item.reward;
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
      return item.joined;
    },
    sortable: true,
    sortFunction: (a, b) => {
      return new Date(a.joined).getTime() - new Date(b.joined).getTime();
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
        />
      </CardBody>
    </Card>
  );
}
