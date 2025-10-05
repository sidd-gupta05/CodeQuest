import { TabsList, TabsTrigger } from '@radix-ui/react-tabs';

export const InventoryTabs = ({
  tabs,
}: {
  tabs: { value: string; label: string }[];
}) => (
  <TabsList className="grid w-full grid-cols-5 bg-[#F1F5F9] text-[#64748B]">
    {tabs.map((tab) => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
);
