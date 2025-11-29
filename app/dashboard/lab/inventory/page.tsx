// app/dashboard/lab/inventory/page.tsx
'use client';
import React, { useState } from 'react';
import { clashFontRegular } from '@/app/fonts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  PackageOpen,
} from 'lucide-react';
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
import { useInventory } from '@/app/context/InventoryContext';
import toast from 'react-hot-toast';

const Inventory = () => {
  const {
    labId,
    inventory,
    customReagents,
    testCatalog,
    reagentCatalog,
    loading: contextLoading,
    fetchData,
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [executionLoading, setExecutionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  // Get reagent details by ID
  const getReagentDetails = (reagentId: string) => {
    const catalogReagent = reagentCatalog.find((r) => r.id === reagentId);
    if (catalogReagent) return catalogReagent;

    const customReagent = customReagents.find((r) => r.id === reagentId);
    if (customReagent) return customReagent;

    return undefined;
  };

  // Calculate stock status
  const getStockStatus = (
    quantity: number,
    threshold: number = 0,
    expiryDate?: string
  ) => {
    const today = new Date();
    const expiry = expiryDate ? new Date(expiryDate) : null;

    if (expiry && expiry <= today) {
      return { status: 'expired', color: 'destructive', icon: XCircle };
    }

    if (expiry) {
      const daysToExpiry = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysToExpiry <= 7) {
        return { status: 'expiring', color: 'destructive', icon: AlertCircle };
      }
    }

    if (quantity <= 0) {
      return { status: 'out-of-stock', color: 'destructive', icon: XCircle };
    }

    if (threshold && quantity <= threshold) {
      return { status: 'low-stock', color: 'secondary', icon: AlertTriangle };
    }

    return { status: 'good', color: 'default', icon: CheckCircle };
  };

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter((item) => {
    const reagent = item.ReagentCatalog || item.CustomReagent;
    if (!reagent) return false;

    const matchesSearch =
      reagent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.batchNumber &&
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      filterCategory === 'all' || reagent?.category === filterCategory;

    const matchesLab = item.labId === labId;

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

  // Calculate additional metrics for enhanced UI
  const totalQuantity = filteredInventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const averageStockLevel =
    totalReagents > 0 ? Math.round(totalQuantity / totalReagents) : 0;

  // Handle bell icon click
  const handleAlertClick = () => {
    setActiveTab('alerts');
  };

  // Real test execution with API
  const executeTest = async (testId: string) => {
    if (!labId) {
      toast('No lab selected');
      return;
    }

    setExecutionLoading(true);
    try {
      const test = testCatalog.find((t) => t.id === testId);
      if (!test) throw new Error('Test not found');

      const bookingId = 'temp-booking-id';
      const patientId = 'temp-patient-id';

      const response = await fetch(
        `/api/lab/${labId}/tests/${testId}/execute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            patientId,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to execute test');
      }

      const result = await response.json();
      await fetchData();
      toast(`Test "${test.name}" executed successfully!`);
    } catch (error) {
      console.error('Error executing test:', error);
      toast(error instanceof Error ? error.message : 'Failed to execute test');
    } finally {
      setExecutionLoading(false);
    }
  };

  // Convert real data to compatible format for components
  const compatibleTestCatalog = testCatalog.map((test) => ({
    ...test,
    reagents: test.TestReagent.map((tr) => ({
      reagentId: tr.reagentId,
      quantity: tr.quantityPerTest,
      unit: tr.unit,
    })),
  }));

  const compatibleInventory = inventory.map((item) => ({
    id: item.id,
    labId: item.labId,
    reagentId: item.reagentId || item.customReagentId || '',
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: item.expiryDate || '',
    reorderThreshold: item.reorderThreshold || 0,
    batchNumber: item.batchNumber || '',
    location: 'Main Storage',
  }));

  const compatibleReagentCatalog = [...reagentCatalog, ...customReagents].map(
    (item) => ({
      id: item.id,
      name: item.name,
      category: item.category || 'Uncategorized',
      description: item.description,
      manufacturer: item.manufacturer,
      unit: item.unit,
    })
  );

  if (contextLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center ${clashFontRegular.className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading inventory data...
          </div>
        </div>
      </div>
    );
  }

  if (!labId) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center ${clashFontRegular.className}`}
      >
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <PackageOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Lab Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please make sure you have a lab associated with your account to
            access inventory management.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Set Up Lab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        `min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 ` +
        clashFontRegular.className
      }
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <InventoryHeader
          lowStockCount={lowStockCount}
          expiringCount={expiringCount}
          totalReagents={totalReagents}
          averageStockLevel={averageStockLevel}
          onAlertClick={handleAlertClick}
        />

        {/* Enhanced Dashboard Metrics */}
        <InventoryMetrics
          total={totalReagents}
          lowStock={lowStockCount}
          expiring={expiringCount}
          tests={testCatalog.length}
          averageStock={averageStockLevel}
        />

        {/* Enhanced Main Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-0"
          >
            <div className="border-b border-gray-100">
              <InventoryTabs
                tabs={[
                  { value: 'inventory', label: 'Inventory', icon: PackageOpen },
                  { value: 'tests', label: 'Test Catalog', icon: TrendingUp },
                  {
                    value: 'execute',
                    label: 'Execute Tests',
                    icon: CheckCircle,
                  },
                  {
                    value: 'custom',
                    label: 'Custom Reagents',
                    icon: AlertCircle,
                  },
                  { value: 'alerts', label: 'Alerts', icon: AlertTriangle },
                ]}
              />
            </div>

            {/* Enhanced Inventory Management */}
            <TabsContent value="inventory" className="space-y-6 p-6 m-0">
              <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="p-6 border-b border-gray-100">
                  <InDialogHeader
                    font={clashFontRegular}
                    reagentCatalog={reagentCatalog}
                    customReagents={customReagents}
                    selectedLab={labId!}
                    onReagentAdded={fetchData}
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <SearchFilter
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      filterCategory={filterCategory}
                      setFilterCategory={setFilterCategory}
                    />
                    <InTabs
                      loading={executionLoading}
                      filteredInventory={compatibleInventory}
                      sampleReagentCatalog={compatibleReagentCatalog}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Test Catalog */}
            <TabsContent value="tests" className="space-y-6 p-6 m-0">
              <TestCatalog
                sampleTestCatalog={compatibleTestCatalog}
                inventory={compatibleInventory}
                selectedLab={labId!}
                getReagentDetails={getReagentDetails}
                onTestAdded={fetchData}
                reagentCatalog={reagentCatalog}
              />
            </TabsContent>

            {/* Enhanced Test Execution */}
            <TabsContent value="execute" className="space-y-6 p-6 m-0">
              <TestExecution
                sampleTestCatalog={compatibleTestCatalog}
                inventory={compatibleInventory}
                selectedLab={labId!}
                loading={executionLoading}
                executeTest={executeTest}
                getReagentDetails={getReagentDetails}
              />
            </TabsContent>

            {/* Enhanced Custom Reagents */}
            <TabsContent value="custom" className="space-y-6 p-6 m-0">
              <CustomReagents
                reagents={customReagents}
                selectedLab={labId!}
                getStockStatus={getStockStatus}
                onReagentAdded={fetchData}
              />
            </TabsContent>

            {/* Enhanced Alerts */}
            <TabsContent value="alerts" className="space-y-6 p-6 m-0">
              <Alerts
                filteredInventory={compatibleInventory}
                getReagentDetails={getReagentDetails}
                getStockStatus={getStockStatus}
                lowStockCount={lowStockCount}
                expiringCount={expiringCount}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
