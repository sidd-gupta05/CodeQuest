<<<<<<< HEAD
//components/inventory/InventoryTabs.tsx
import { TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { LucideIcon } from 'lucide-react';

export const InventoryTabs = ({
  tabs,
}: {
  tabs: { value: string; label: string; icon?: LucideIcon }[];
}) => (
  <TabsList className="flex w-full bg-transparent p-2">
    {tabs.map((tab) => {
      const IconComponent = tab.icon;
      return (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="flex items-center gap-2 flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
        >
          {IconComponent && <IconComponent className="h-4 w-4" />}
          {tab.label}
        </TabsTrigger>
      );
    })}
=======
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export const InventoryTabs = ({ tabs }: { tabs: { value: string; label: string }[] }) => (
  <TabsList className="grid w-full grid-cols-5 bg-[#F1F5F9] text-[#64748B]">
    {tabs.map(tab => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
      >
        {tab.label}
      </TabsTrigger>
    ))}
>>>>>>> 8f4a36f (inventory components)
  </TabsList>
);
