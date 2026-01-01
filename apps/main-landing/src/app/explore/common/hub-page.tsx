'use client';

import { useMemo, useState } from 'react';
import { Card } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { Input } from '@idriss-xyz/ui/input';
import { classes } from '@idriss-xyz/ui/utils';

import { TopBar } from '../../components/top-bar';
import type { HubStreamer, HubStreamerUser } from '../types';
import { useGetBatchTwitchStreamStatus } from '../../app/commands/get-batch-twitch-stream-status';

import HubItemCard, { CardTheme } from './hub-item-card';

export interface HubTheme {
  radialBg: string;
  filterBorder: string;
  filterText: string;
  filterActiveBorder: string;
  filterActiveBg: string;
  cardTheme: CardTheme;
  titleClass?: string;
}

interface Properties {
  title: string;
  bannerImage: string;
  groups: HubStreamer[];
  theme: HubTheme;
  align?: 'center' | 'left';
  partnerLogo?: string;
}

const split = (v?: string) => {
  return v
    ? v
        .split(',')
        .map((t) => {
          return t.trim();
        })
        .filter(Boolean)
    : [];
};

export default function HubPage({
  title,
  bannerImage,
  groups,
  theme,
  align = 'center',
  partnerLogo,
}: Properties) {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');

  // Get all streamer names for batch fetching
  const allStreamerNames = useMemo(() => {
    return groups.flatMap((g) => {
      return g.users.map((u) => {
        return u.name;
      });
    });
  }, [groups]);

  // Fetch live statuses
  const { data: streamStatusData } = useGetBatchTwitchStreamStatus(
    { names: allStreamerNames },
    { enabled: allStreamerNames.length > 0 },
  );

  const liveStatuses = streamStatusData?.liveStatuses ?? {};

  /* filter + search ------------------------------------------------------ */
  const filters = useMemo(() => {
    const s = new Set<string>();
    for (const g of groups)
      for (const u of g.users) {
        for (const t of split(u.languages)) s.add(t);
        for (const t of split(u.filters)) s.add(t);
      }

    return ['All', ...s];
  }, [groups]);

  const visible = useMemo(() => {
    const byTag = (u: HubStreamerUser) => {
      return (
        active === 'All' ||
        split(u.languages).includes(active) ||
        split(u.filters).includes(active)
      );
    };

    const bySearch = (u: HubStreamerUser) => {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        u.name.toLowerCase().startsWith(q) ||
        [...split(u.languages), ...split(u.filters)].some((t) => {
          return t.toLowerCase().includes(q);
        })
      );
    };

    return groups
      .map((g) => {
        return {
          ...g,
          users: g.users.filter((u) => {
            return byTag(u) && bySearch(u);
          }),
        };
      })
      .filter((g) => {
        return g.users.length;
      });
  }, [groups, active, query]);

  /* render ---------------------------------------------------------------- */
  return (
    <>
      <TopBar stickyEnabled={false} />

      <main
        className={classes(
          'relative flex min-h-screen flex-col items-center gap-4 px-2 pb-1 pt-[56px]',
          theme.radialBg,
        )}
      >
        <div className="mt-8 w-full max-w-[1176px] rounded-2xl bg-neutral-100">
          <div className="grid grid-cols-3 gap-4">
            {/* banner */}
            <Card className="col-span-3 p-0">
              <div className="relative h-[180px] overflow-hidden rounded-2xl">
                <img
                  src={bannerImage}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <div
                  className={classes(
                    'absolute flex flex-col gap-4.5 px-4',
                    align === 'center'
                      ? 'left-1/2 top-1/2 h-[86px] -translate-x-1/2 -translate-y-1/2 items-center'
                      : 'left-12 top-1/2 -translate-y-1/2 items-start',
                  )}
                >
                  {partnerLogo && (
                    <img src={partnerLogo} alt="Partner logo" className="h-8" />
                  )}
                  {partnerLogo ? (
                    <div className="flex items-center gap-4">
                      <h4
                        className={classes(
                          'w-full text-nowrap text-heading4 uppercase text-white',
                          theme.titleClass,
                        )}
                      >
                        {title}
                      </h4>
                      <Input
                        className="w-[483px]"
                        placeholder="Search streamers or games"
                        value={query}
                        onChange={(inputEvent) => {
                          setQuery(inputEvent.target.value);
                          setActive('All');
                        }}
                        prefixElement={
                          <Icon
                            name="Search"
                            size={16}
                            className="text-[#757575]"
                          />
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <h4
                        className={classes(
                          'text-heading4 uppercase text-white',
                          theme.titleClass,
                        )}
                      >
                        {title}
                      </h4>
                      <Input
                        className="w-[483px]"
                        placeholder="Search streamers or games"
                        value={query}
                        onChange={(inputEvent) => {
                          setQuery(inputEvent.target.value);
                          setActive('All');
                        }}
                        prefixElement={
                          <Icon
                            name="Search"
                            size={16}
                            className="text-[#757575]"
                          />
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* filter / list */}
            <div className="col-span-3 pl-3">
              <div className="flex items-center gap-4">
                <div className="flex flex-wrap gap-1.5 font-medium">
                  {filters.map((f) => {
                    return (
                      <span
                        key={f}
                        onClick={() => {
                          return setActive(f);
                        }}
                        className={classes(
                          'flex h-[34px] cursor-pointer items-center justify-center rounded-full border px-3 py-1 text-label4',
                          theme.filterBorder,
                          theme.filterText,
                          active === f
                            ? classes(
                                theme.filterActiveBorder,
                                theme.filterActiveBg,
                                'text-white',
                              )
                            : 'bg-white/80',
                        )}
                      >
                        {f}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 py-2">
                {visible.map((g) => {
                  return (
                    <div key={g.header} className="flex flex-col gap-3">
                      <h3 className="text-heading3">{g.header}</h3>
                      <div className="flex flex-wrap gap-3">
                        {g.users.map((u) => {
                          return (
                            <HubItemCard
                              key={u.id}
                              streamer={u}
                              theme={theme.cardTheme}
                              isLive={liveStatuses[u.name] ?? false}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
