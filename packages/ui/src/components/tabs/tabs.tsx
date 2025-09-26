import * as RadixTabs from '@radix-ui/react-tabs';
import { ReactNode, useState } from 'react';

export type TabItem = {
  key: string;
  label: ReactNode;
  children: ReactNode;
};

type Properties = {
  items: TabItem[];
  initialTab?: string;
  onChange?: (tabKey: string) => void;
};

export const Tabs = ({ items, initialTab, onChange }: Properties) => {
  const [activeTab, setActiveTab] = useState(initialTab ?? items[0]?.key);

  return (
    <RadixTabs.Root
      className="flex flex-col"
      defaultValue={activeTab}
      onValueChange={(value) => {
        setActiveTab(value);
        onChange?.(value);
      }}
    >
      <RadixTabs.List className="relative flex shrink-0 border-b border-neutral-300">
        {items.map((item) => {
          return (
            <RadixTabs.Trigger
              key={item.key}
              className="flex h-[40px] flex-1 cursor-pointer select-none items-center justify-center px-5 text-button2 leading-none text-neutral-900 outline-none"
              value={item.key}
            >
              {item.label}
            </RadixTabs.Trigger>
          );
        })}
        {/* Sliding indicator */}
        <div
          className="absolute bottom-0 left-0 h-px bg-mint-500 transition-transform duration-300"
          style={{
            width: `${100 / items.length}%`,
            transform: `translateX(${
              items.findIndex((item) => {
                return item.key === activeTab;
              }) * 100
            }%)`,
          }}
        />
      </RadixTabs.List>
      {items.map((item) => {
        return (
          <RadixTabs.Content
            key={item.key}
            value={item.key}
            className="grow rounded-b-md outline-none"
          >
            {item.children}
          </RadixTabs.Content>
        );
      })}
    </RadixTabs.Root>
  );
};
