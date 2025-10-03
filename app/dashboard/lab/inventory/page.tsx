// app/dashboard/lab/inventory/page.tsx
'use client';
import React, { useState } from 'react';
import { interFont } from '@/app/fonts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import {
  InventoryHeader,
  InventoryMetrics,
  SearchFilter,
  InventoryTabs,
  InDialogHeader,
  InTabs,
  TestCatalog,
  TestExecution,
  CustomReagents,
  Alerts,
} from '@/components/inventory';

import { sampleTestCatalog, sampleReagentCatalog, sampleLabInventory, sampleCustomReagents } from '@/types/metadata';

const Inventory = () => {
  const [selectedLab, setSelectedLab] = useState('lab1');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState(sampleLabInventory);
  const [customReagents, setCustomReagents] = useState(sampleCustomReagents);
  const [pageLoading, setPageLoading] = useState(true);

  // Get reagent details by ID
  const getReagentDetails = (reagentId: string) => {
    return sampleReagentCatalog.find((r) => r.id === reagentId);
  };

  // Calculate stock status
  const getStockStatus = (
    quantity: number,
    threshold: number,
    expiryDate: string
  ) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysToExpiry <= 0)
      return { status: 'expired', color: 'destructive', icon: XCircle };
    if (daysToExpiry <= 7)
      return { status: 'expiring', color: 'destructive', icon: AlertCircle };
    if (quantity <= 0)
      return { status: 'out-of-stock', color: 'destructive', icon: XCircle };
    if (quantity <= threshold)
      return { status: 'low-stock', color: 'secondary', icon: AlertTriangle };
    return { status: 'good', color: 'default', icon: CheckCircle };
  };

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter((item) => {
    const reagent = getReagentDetails(item.reagentId);
    const matchesSearch =
      reagent?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || reagent?.category === filterCategory;
    const matchesLab = item.labId === selectedLab;
    return matchesSearch && matchesCategory && matchesLab;
  });

  // Calculate dashboard metrics
  const totalReagents = filteredInventory.length;
  const lowStockCount = filteredInventory.filter((item) => {
    const status = getStockStatus(
      item.quantity,
      item.reorderThreshold,
      item.expiryDate
    );
    return status.status === 'low-stock' || status.status === 'out-of-stock';
  }).length;
  const expiringCount = filteredInventory.filter((item) => {
    const status = getStockStatus(
      item.quantity,
      item.reorderThreshold,
      item.expiryDate
    );
    return status.status === 'expiring' || status.status === 'expired';
  }).length;

  // Simulate test execution
  const executeTest = async (testId: string) => {
    setLoading(true);
    const test = sampleTestCatalog.find((t) => t.id === testId);
    if (!test) return;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Deduct reagents from inventory
    const updatedInventory = inventory.map((item) => {
      const reagentUsage = test.reagents.find(
        (r) => r.reagentId === item.reagentId
      );
      if (reagentUsage && item.labId === selectedLab) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - reagentUsage.quantity),
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setLoading(false);
  };
  return (
    <div className={`min-h-screen bg-gray-50 p-6 ` + interFont.className}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <InventoryHeader
          lowStockCount={lowStockCount}
          expiringCount={expiringCount}
        />

        {/* Dashboard Metrics */}
        <InventoryMetrics
          total={totalReagents}
          lowStock={lowStockCount}
          expiring={expiringCount}
          tests={sampleTestCatalog.length}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <InventoryTabs
            tabs={[
              { value: 'inventory', label: 'Inventory' },
              { value: 'tests', label: 'Test Catalog' },
              { value: 'execute', label: 'Execute Tests' },
              { value: 'custom', label: 'Custom Reagents' },
              { value: 'alerts', label: 'Alerts' },
            ]}
          />

          {/* Inventory Management */}
          <TabsContent
            value="inventory"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <Card className="bg-white border-[#F7F8F9]">
              <InDialogHeader
                font={interFont}
                sampleReagentCatalog={sampleReagentCatalog}
              />
              <CardContent>
                <SearchFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                />
                <InTabs
                  loading={loading}
                  filteredInventory={filteredInventory}
                  sampleReagentCatalog={sampleReagentCatalog}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Catalog */}
          <TabsContent
            value="tests"
            className="space-y-6 bg-white border border-gray-100 p-4 rounded-md"
          >
            <TestCatalog
              sampleTestCatalog={sampleTestCatalog}
              inventory={inventory}
              selectedLab={selectedLab}
              getReagentDetails={getReagentDetails}
            />
          </TabsContent>

          {/* Test Execution */}
          <TabsContent
            value="execute"
            className="space-y-6 bg-white p-4 rounded-md"
          >
            <TestExecution
              sampleTestCatalog={sampleTestCatalog}
              inventory={inventory}
              selectedLab={selectedLab}
              loading={loading}
              executeTest={executeTest}
              getReagentDetails={getReagentDetails}
            />
          </TabsContent>

          {/* Custom Reagents */}
          <TabsContent
            value="custom"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <CustomReagents
              reagents={customReagents}
              selectedLab={selectedLab}
              getStockStatus={getStockStatus}
            />
          </TabsContent>

          {/* Alerts */}
          <TabsContent
            value="alerts"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <Alerts
              filteredInventory={filteredInventory}
              getReagentDetails={getReagentDetails}
              getStockStatus={getStockStatus}
              lowStockCount={lowStockCount}
              expiringCount={expiringCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;