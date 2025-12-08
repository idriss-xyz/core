'use client';

import { useMemo, useState } from 'react';
import { Card } from '@idriss-xyz/ui/card';
import { classes } from '@idriss-xyz/ui/utils';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Icon } from '@idriss-xyz/ui/icon';
import { Input } from '@idriss-xyz/ui/input';

import { backgroundLines2, IDRISS_SCENE_STREAM_2 } from '@/assets';

import { TopBar } from '../components/top-bar';

import HubItemCard from './hub-item-card';
import type { HubStreamer, HubStreamerUser } from './types';
import streamersData from './data.json';

const split = (value?: string) => {
  return value
    ? value
        .split(',')
        .map((v) => {
          return v.trim();
        })
        .filter(Boolean)
    : [];
};

// ts-unused-exports:disable-next-line
export default function HubPage() {
  const groups = streamersData as HubStreamer[];

  const filterOptions = useMemo(() => {
    const set = new Set<string>();
    for (const g of groups) {
      for (const u of g.users) {
        for (const t of split(u.languages)) set.add(t);
        for (const t of split(u.filters)) set.add(t);
      }
    }
    return ['All', ...set];
  }, [groups]);

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const visible = useMemo<HubStreamer[]>(() => {
    const passesTag = (u: HubStreamerUser) => {
      return (
        activeFilter === 'All' ||
        split(u.languages).includes(activeFilter) ||
        split(u.filters).includes(activeFilter)
      );
    };

    const passesSearch = (u: HubStreamerUser) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      const nameMatch = u.name.toLowerCase().startsWith(q);
      const tagMatch =
        split(u.languages).some((l) => {
          return l.toLowerCase().includes(q);
        }) ||
        split(u.filters).some((f) => {
          return f.toLowerCase().includes(q);
        });
      return nameMatch || tagMatch;
    };

    return groups
      .map((g) => {
        return {
          ...g,
          users: g.users.filter((u) => {
            return passesTag(u) && passesSearch(u);
          }),
        };
      })
      .filter((g) => {
        return g.users.length > 0;
      });
  }, [activeFilter, searchQuery, groups]);

  return (
    <>
      <TopBar />

      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute inset-0 z-0 hidden size-full object-cover opacity-40 lg:block"
        />
        <div className="relative z-10 mt-8 grid w-full max-w-[1176px] grid-cols-3 gap-4 rounded-2xl bg-neutral-100">
          {/* HEADER BANNER */}
          <Card className="col-span-3 p-0">
            <div className="relative h-[180px] overflow-hidden rounded-2xl">
              <img
                alt="idriss stream"
                src={IDRISS_SCENE_STREAM_2.src}
                className="absolute inset-0 z-0 size-full object-cover object-[center_30%] lg:object-[center_60%] 3xl:object-[center_70%]"
              />
              <div className="absolute inset-0 z-10 bg-black/20" />
              <div className="absolute left-1/2 top-1/2 z-20 flex h-[86px] w-[512px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4.5 px-4">
                <h4 className={classes('text-heading4 uppercase text-white')}>
                  Streamer Hub
                </h4>
                <Input
                  className="w-full"
                  placeholder="Search streamers or games"
                  value={searchQuery}
                  onChange={(inputEvent) => {
                    return setSearchQuery(inputEvent.target.value);
                  }}
                  prefixElement={
                    <Icon name="Search" size={16} className="text-[#757575]" />
                  }
                />
              </div>
            </div>
          </Card>

          {/* FILTER + LIST */}
          <div className="col-span-3 pl-3">
            <ScrollArea className="-mr-3 max-h-[calc(100vh_-_300px)]">
              <div className="flex items-center gap-4">
                <div className="flex flex-wrap gap-1.5 font-medium">
                  {filterOptions.map((option) => {
                    return (
                      <span
                        key={option}
                        onClick={() => {
                          return setActiveFilter(option);
                        }}
                        className={classes(
                          'flex h-[34px] cursor-pointer items-center justify-center rounded-full border border-mint-400 px-3 py-1 text-label4 text-neutralGreen-900',
                          activeFilter === option
                            ? 'border-neutralGreen-900 bg-neutralGreen-900 text-white'
                            : 'bg-white/80',
                        )}
                      >
                        {option}
                      </span>
                    );
                  })}
                </div>
              </div>
              {/* cards grid */}
              <div className="flex flex-col gap-3 py-2">
                {visible.map((group) => {
                  return (
                    <div key={group.header} className="flex flex-col gap-3">
                      <h3 className={classes('text-heading3')}>
                        {group.header}
                      </h3>
                      <div className="flex flex-wrap justify-start gap-3">
                        {group.users.map((user) => {
                          return <HubItemCard key={user.id} streamer={user} />;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </>
  );
}
