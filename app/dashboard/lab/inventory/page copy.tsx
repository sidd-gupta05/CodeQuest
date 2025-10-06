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
import { useInventory } from '@/app/context/InventoryContext';

const Inventory = () => {
  
  const Inventory = () => {
    const {
      labId,
      inventory,
      customReagents,
      testCatalog,
      reagentCatalog,
      loading: contextLoading,
      setLabId,
      setInventory,
      setCustomReagents,
      setTestCatalog,
      setReagentCatalog,
    } = useInventory();
  
    
  const [selectedLab, setSelectedLab] = useState('lab1');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  // const [inventory, setInventory] = useState(sampleLabInventory);
  // const [customReagents, setCustomReagents] = useState(sampleCustomReagents);
  const [pageLoading, setPageLoading] = useState(true);
  const [executionLoading, setExecutionLoading] = useState(false);
  
    // Get reagent details by ID
    const getReagentDetails = (reagentId: string) => {
      // First check reagent catalog
      const catalogReagent = reagentCatalog.find((r) => r.id === reagentId);
      if (catalogReagent) return catalogReagent;
  
      // Then check custom reagents
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
        const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
        (item.batchNumber && item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
  
      const fetchData = async () => {
    if (!labId) return;
    
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [inventoryRes, customReagentsRes, testsRes, reagentsRes] = await Promise.all([
        fetch(`/api/lab/${labId}/inventory`),
        fetch(`/api/lab/${labId}/custom-reagents`),
        fetch(`/api/lab/${labId}/tests`),
        fetch('/api/reagents/')
      ]);

      if (inventoryRes.ok) setInventory(await inventoryRes.json());
      if (customReagentsRes.ok) setCustomReagents(await customReagentsRes.json());
      if (testsRes.ok) setTestCatalog(await testsRes.json());
      if (reagentsRes.ok) setReagentCatalog(await reagentsRes.json());

    } catch (err: any) {
      console.error('Error fetching inventory data:', err);
    } finally {
      setLoading(false);
    }
  };
    // Real test execution with API
    const executeTest = async (testId: string) => {
      if (!labId) {
        alert('No lab selected');
        return;
      }
  
      setExecutionLoading(true);
      try {
        const test = testCatalog.find((t) => t.id === testId);
        if (!test) throw new Error('Test not found');
  
        // You'll need to get bookingId and patientId from your UI state or props
        const bookingId = "temp-booking-id"; // Replace with actual booking selection
        const patientId = "temp-patient-id"; // Replace with actual patient selection
  
        const response = await fetch(`/api/lab/${labId}/tests/${testId}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            patientId,
            quantity: 1
          }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to execute test');
        }
  
        const result = await response.json();
        
        // Refresh inventory data
        await fetchData();
        
        // Show success message
        alert(`Test "${test.name}" executed successfully!`);
        
      } catch (error) {
        console.error('Error executing test:', error);
        alert(error instanceof Error ? error.message : 'Failed to execute test');
      } finally {
        setExecutionLoading(false);
      }
    };
  
    // Convert real data to compatible format for components
    const compatibleTestCatalog = testCatalog.map(test => ({
      ...test,
      reagents: test.TestReagent.map(tr => ({
        reagentId: tr.reagentId,
        quantity: tr.quantityPerTest,
        unit: tr.unit
      }))
    }));
  
    const compatibleInventory = inventory.map(item => ({
      id: item.id,
      labId: item.labId,
      reagentId: item.reagentId || item.customReagentId || '',
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate || '',
      reorderThreshold: item.reorderThreshold || 0,
      batchNumber: item.batchNumber || '',
      location: 'Main Storage' // Default value for compatibility
    }));
  
    const compatibleReagentCatalog = [...reagentCatalog, ...customReagents].map(item => ({
      id: item.id,
      name: item.name,
      category: item.category || 'Uncategorized',
      description: item.description,
      manufacturer: item.manufacturer,
      unit: item.unit
    }));
  
    if (contextLoading) {
      return (
        <div className={`min-h-screen bg-gray-50 p-6 flex items-center justify-center ${interFont.className}`}>
          <div className="text-center">Loading inventory data...</div>
        </div>
      );
    }
  
    if (!labId) {
      return (
        <div className={`min-h-screen bg-gray-50 p-6 flex items-center justify-center ${interFont.className}`}>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Lab Found</h2>
            <p className="text-gray-600">Please make sure you have a lab associated with your account.</p>
          </div>
        </div>
      );
    }
  

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
          tests={testCatalog.length}
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