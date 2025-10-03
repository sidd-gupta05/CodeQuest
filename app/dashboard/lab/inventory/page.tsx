// app/dashboard/lab/inventory/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { interFont } from '@/app/fonts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Calendar,
  Package,
  TestTube,
  Plus,
  Search,
  Filter,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { InventoryMetrics } from '@/components/inventory/InventoryMetrics';
import { SearchFilter } from '@/components/inventory/SearchFilter';
import { InventoryTabs } from '@/components/inventory/InventoryTabs';
import InDialogHeader from '@/components/inventory/management/InDialogHeader';
import InTabs from '@/components/inventory/management/InTabs';

// Sample data for the lab inventory system
const sampleLabs = [
  { id: 'lab1', name: 'Central Lab - Building A' },
  { id: 'lab2', name: 'Research Lab - Building B' },
  { id: 'lab3', name: 'Clinical Lab - Building C' },
];

const sampleTestCatalog = [
  {
    id: 'test1',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    duration: '30 min',
    reagents: [
      { reagentId: 'reagent1', quantity: 2, unit: 'ml' },
      { reagentId: 'reagent2', quantity: 1, unit: 'ml' },
    ],
  },
  {
    id: 'test2',
    name: 'COVID-19 PCR Test',
    category: 'Molecular',
    duration: '2 hours',
    reagents: [
      { reagentId: 'reagent3', quantity: 5, unit: 'ml' },
      { reagentId: 'reagent4', quantity: 3, unit: 'ml' },
    ],
  },
  {
    id: 'test3',
    name: 'Urine Analysis',
    category: 'Clinical Chemistry',
    duration: '15 min',
    reagents: [
      { reagentId: 'reagent5', quantity: 1, unit: 'ml' },
      { reagentId: 'reagent1', quantity: 0.5, unit: 'ml' },
    ],
  },
  {
    id: 'test4',
    name: 'Liver Function Test',
    category: 'Clinical Chemistry',
    duration: '45 min',
    reagents: [
      { reagentId: 'reagent2', quantity: 3, unit: 'ml' },
      { reagentId: 'reagent6', quantity: 2, unit: 'ml' },
    ],
  },
];

const sampleReagentCatalog = [
  {
    id: 'reagent1',
    name: 'Hemoglobin Reagent',
    manufacturer: 'BioTech Labs',
    category: 'Hematology',
  },
  {
    id: 'reagent2',
    name: 'Buffer Solution pH 7.4',
    manufacturer: 'ChemCorp',
    category: 'General',
  },
  {
    id: 'reagent3',
    name: 'PCR Master Mix',
    manufacturer: 'MolecularTech',
    category: 'Molecular',
  },
  {
    id: 'reagent4',
    name: 'DNA Extraction Kit',
    manufacturer: 'GeneticSolutions',
    category: 'Molecular',
  },
  {
    id: 'reagent5',
    name: 'Urine Dipstick Solution',
    manufacturer: 'DiagnosticPlus',
    category: 'Clinical Chemistry',
  },
  {
    id: 'reagent6',
    name: 'Enzyme Substrate',
    manufacturer: 'BioEnzymes Inc',
    category: 'Clinical Chemistry',
  },
];

const sampleLabInventory = [
  {
    id: 'inv1',
    labId: 'lab1',
    reagentId: 'reagent1',
    quantity: 150,
    unit: 'ml',
    expiryDate: '2024-12-15',
    reorderThreshold: 50,
    batchNumber: 'HB2024001',
  },
  {
    id: 'inv2',
    labId: 'lab1',
    reagentId: 'reagent2',
    quantity: 25,
    unit: 'ml',
    expiryDate: '2024-11-30',
    reorderThreshold: 100,
    batchNumber: 'BUF2024002',
  },
  {
    id: 'inv3',
    labId: 'lab1',
    reagentId: 'reagent3',
    quantity: 200,
    unit: 'ml',
    expiryDate: '2025-03-20',
    reorderThreshold: 75,
    batchNumber: 'PCR2024003',
  },
  {
    id: 'inv4',
    labId: 'lab1',
    reagentId: 'reagent4',
    quantity: 5,
    unit: 'kit',
    expiryDate: '2024-10-25',
    reorderThreshold: 10,
    batchNumber: 'DNA2024004',
  },
  {
    id: 'inv5',
    labId: 'lab1',
    reagentId: 'reagent5',
    quantity: 80,
    unit: 'ml',
    expiryDate: '2025-01-15',
    reorderThreshold: 30,
    batchNumber: 'UR2024005',
  },
  {
    id: 'inv6',
    labId: 'lab1',
    reagentId: 'reagent6',
    quantity: 45,
    unit: 'ml',
    expiryDate: '2024-11-10',
    reorderThreshold: 60,
    batchNumber: 'ENZ2024006',
  },
];

const sampleCustomReagents = [
  {
    id: 'custom1',
    labId: 'lab1',
    name: 'Custom Antibody Solution',
    description: 'Lab-specific antibody for research',
    quantity: 30,
    unit: 'ml',
    expiryDate: '2024-12-01',
    reorderThreshold: 15,
  },
];

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
        <InventoryHeader lowStockCount={lowStockCount} expiringCount={expiringCount} />

        {/* Dashboard Metrics */}
        <InventoryMetrics total={totalReagents} lowStock={lowStockCount} expiring={expiringCount} tests={sampleTestCatalog.length} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <InventoryTabs tabs={[
            { value: "inventory", label: "Inventory" },
            { value: "tests", label: "Test Catalog" },
            { value: "execute", label: "Execute Tests" },
            { value: "custom", label: "Custom Reagents" },
            { value: "alerts", label: "Alerts" },
          ]} />

          {/* Inventory Management */}
          <TabsContent
            value="inventory"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <Card className="bg-white border-[#F7F8F9]">
              <InDialogHeader font={interFont} sampleReagentCatalog={sampleReagentCatalog} />
              <CardContent>
                <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
                <InTabs loading={loading} filteredInventory={filteredInventory} sampleReagentCatalog={sampleReagentCatalog} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Catalog */}
          <TabsContent
            value="tests"
            className="space-y-6 bg-white border border-gray-100 p-4 rounded-md"
          >
            <Card className="border-gray-100 ">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold ">
                  Available Tests
                </CardTitle>
                <CardDescription className="font-medium text-[#838FA2]">
                  View test catalog and reagent requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-gray-100">
                  {sampleTestCatalog.map((test) => (
                    <Card
                      key={test.id}
                      className="border-l-4 border-gray-300 border-l-blue-500"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{test.name}</CardTitle>
                          <Badge
                            className="bg-[#F3F6FA] border-gray-100"
                            variant="outline"
                          >
                            {test.category}
                          </Badge>
                        </div>
                        <CardDescription className="font-medium text-[#838FA2]">
                          Duration: {test.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-bold text-sm">
                            Required Reagents:
                          </h4>
                          {test.reagents.map((reagent, index) => {
                            const reagentDetails = getReagentDetails(
                              reagent.reagentId
                            );
                            const inventoryItem = inventory.find(
                              (item) =>
                                item.reagentId === reagent.reagentId &&
                                item.labId === selectedLab
                            );
                            const available = inventoryItem
                              ? inventoryItem.quantity >= reagent.quantity
                              : false;

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span>{reagentDetails?.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span>
                                    {reagent.quantity} {reagent.unit}
                                  </span>
                                  {available ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Execution */}
          <TabsContent
            value="execute"
            className="space-y-6 bg-white p-4 rounded-md"
          >
            <Card className="border-gray-100 ">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold ">
                  Execute Tests
                </CardTitle>
                <CardDescription className="font-medium text-[#838FA2]">
                  Perform tests and automatically deduct reagents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleTestCatalog.map((test) => {
                    const canExecute = test.reagents.every((reagent) => {
                      const inventoryItem = inventory.find(
                        (item) =>
                          item.reagentId === reagent.reagentId &&
                          item.labId === selectedLab
                      );
                      return (
                        inventoryItem &&
                        inventoryItem.quantity >= reagent.quantity
                      );
                    });

                    return (
                      <Card
                        key={test.id}
                        className={`${canExecute ? 'border-green-200' : 'border-red-200'}`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {test.name}
                            </CardTitle>
                            <Badge
                              className={
                                canExecute
                                  ? 'bg-[#272E3F] text-white'
                                  : 'bg-red-700 text-white'
                              }
                              variant={canExecute ? 'default' : 'destructive'}
                            >
                              {canExecute ? 'Ready' : 'Insufficient Stock'}
                            </Badge>
                          </div>
                          <CardDescription className="font-medium text-[#838FA2]">
                            {test.category} • {test.duration}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-bold text-sm">
                                Reagent Consumption:
                              </h4>
                              {test.reagents.map((reagent, index) => {
                                const reagentDetails = getReagentDetails(
                                  reagent.reagentId
                                );
                                const inventoryItem = inventory.find(
                                  (item) =>
                                    item.reagentId === reagent.reagentId &&
                                    item.labId === selectedLab
                                );

                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span>{reagentDetails?.name}</span>
                                    <span className="text-gray-600">
                                      -{reagent.quantity} {reagent.unit}
                                      {inventoryItem && (
                                        <span className="ml-2 text-xs">
                                          (Available: {inventoryItem.quantity}{' '}
                                          {inventoryItem.unit})
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <Button
                              className="w-full  hover:bg-[#272E3F] text-white bg-[#1e2530]"
                              disabled={!canExecute || loading}
                              onClick={() => executeTest(test.id)}
                            >
                              {loading ? (
                                <>
                                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                                  Executing...
                                </>
                              ) : (
                                <>
                                  <TestTube className="h-4 w-4 mr-2" />
                                  Execute Test
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Reagents */}
          <TabsContent
            value="custom"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <Card className="border-gray-100">
              <CardHeader className="border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      Custom Reagents
                    </CardTitle>
                    <CardDescription className="font-medium text-[#64748B]">
                      Lab-specific reagents and solutions
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0F172A] text-white hover:bg-[#272E3F] p-4  py-6 text-md">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Reagent
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={`${interFont.className} bg-white border-[#F7F8F9] max-w-lg `}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Add Custom Reagent
                        </DialogTitle>
                        <DialogDescription className="font-medium text-[#838FA2]">
                          Create a lab-specific reagent
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="pb-1" htmlFor="name">
                            Reagent Name
                          </Label>
                          <Input
                            className="border-[#dbdcdd] p-4 py-5 text-md"
                            id="name"
                            placeholder="Custom Antibody Solution"
                          />
                        </div>
                        <div>
                          <Label className="pb-1" htmlFor="description">
                            Description
                          </Label>
                          <Textarea
                            className="border-[#dbdcdd] p-4  text-md"
                            id="description"
                            placeholder="Detailed description of the reagent..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="pb-1 text-md" htmlFor="quantity">
                              Initial Quantity
                            </Label>
                            <Input
                              className="border-[#dbdcdd] p-4 py-5 text-md"
                              id="quantity"
                              type="number"
                              placeholder="50"
                            />
                          </div>
                          <div>
                            <Label className="pb-1 text-md" htmlFor="unit">
                              Unit
                            </Label>
                            <Select>
                              <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                                <SelectValue
                                  className="border-[#F7F8F9] text-lg"
                                  placeholder="ml"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                                <SelectItem
                                  className="pl-3 hover:bg-gray-200"
                                  value="ml"
                                >
                                  ml
                                </SelectItem>
                                <SelectItem
                                  className="pl-3 hover:bg-gray-200"
                                  value="l"
                                >
                                  l
                                </SelectItem>
                                <SelectItem
                                  className="pl-3 hover:bg-gray-200"
                                  value="kit"
                                >
                                  kit
                                </SelectItem>
                                <SelectItem
                                  className="pl-3 hover:bg-gray-200"
                                  value="vial"
                                >
                                  vial
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label className="pb-1 text-md" htmlFor="expiry">
                            Expiry Date
                          </Label>
                          <Input
                            className="border-[#dbdcdd] text-md"
                            id="expiry"
                            type="date"
                          />
                        </div>
                        <div>
                          <Label className="pb-1 text-md" htmlFor="threshold">
                            Reorder Threshold
                          </Label>
                          <Input
                            className="border-[#dbdcdd] p-4 py-5 text-md"
                            id="threshold"
                            type="number"
                            placeholder="15"
                          />
                        </div>
                        <Button className="w-full bg-black text-white cursor-pointer hover:bg-gray-800">
                          Add Custom Reagent
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customReagents
                    .filter((reagent) => reagent.labId === selectedLab)
                    .map((reagent) => {
                      const stockStatus = getStockStatus(
                        reagent.quantity,
                        reagent.reorderThreshold,
                        reagent.expiryDate
                      );
                      const StatusIcon = stockStatus.icon;

                      return (
                        <Card
                          key={reagent.id}
                          className="border-l-4 border-gray-300 border-l-purple-500"
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-bold">
                                {reagent.name}
                              </CardTitle>
                              <Badge
                                variant={stockStatus.color as any}
                                className="flex items-center "
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {stockStatus.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <CardDescription className="font-medium text-[#64748B]">
                              {reagent.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Stock:</span>
                                <p>
                                  {reagent.quantity} {reagent.unit}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">Expiry:</span>
                                <p>{reagent.expiryDate}</p>
                              </div>
                              <div>
                                <span className="font-medium">Threshold:</span>
                                <p>
                                  {reagent.reorderThreshold} {reagent.unit}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                  {customReagents.filter(
                    (reagent) => reagent.labId === selectedLab
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No custom reagents added yet</p>
                      <p className="text-sm">
                        Add lab-specific reagents using the button above
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts */}
          <TabsContent
            value="alerts"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <Card className="border-gray-100">
              <CardHeader className="border-gray-100">
                <CardTitle className="text-2xl font-semibold">
                  Alerts & Notifications
                </CardTitle>
                <CardDescription className="font-medium text-[#64748B]">
                  Monitor stock levels and expiry dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Low Stock Alerts */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg font-semibold flex items-center">
                      <AlertTriangle className="text-2xl font-semibold h-5 w-5 mr-2 text-orange-500" />
                      Low Stock Alerts
                    </h3>
                    {filteredInventory
                      .filter((item) => {
                        const status = getStockStatus(
                          item.quantity,
                          item.reorderThreshold,
                          item.expiryDate
                        );
                        return (
                          status.status === 'low-stock' ||
                          status.status === 'out-of-stock'
                        );
                      })
                      .map((item) => {
                        const reagent = getReagentDetails(item.reagentId);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-orange-50"
                          >
                            <div>
                              <p className="font-medium">{reagent?.name}</p>
                              <p className="text-sm text-gray-600">
                                Current stock: {item.quantity} {item.unit}{' '}
                                (Threshold: {item.reorderThreshold} {item.unit})
                              </p>
                            </div>
                            <Badge variant="secondary">Reorder Required</Badge>
                          </div>
                        );
                      })}
                  </div>

                  {/* Expiry Alerts */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg flex items-center  font-semibold ">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      Expiry Alerts
                    </h3>
                    {filteredInventory
                      .filter((item) => {
                        const status = getStockStatus(
                          item.quantity,
                          item.reorderThreshold,
                          item.expiryDate
                        );
                        return (
                          status.status === 'expiring' ||
                          status.status === 'expired'
                        );
                      })
                      .map((item) => {
                        const reagent = getReagentDetails(item.reagentId);
                        const today = new Date();
                        const expiry = new Date(item.expiryDate);
                        const daysToExpiry = Math.ceil(
                          (expiry.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-red-50"
                          >
                            <div>
                              <p className="font-medium">{reagent?.name}</p>
                              <p className="text-sm text-gray-600">
                                Expires: {item.expiryDate}
                                {daysToExpiry <= 0
                                  ? ' (EXPIRED)'
                                  : ` (${daysToExpiry} days)`}
                              </p>
                            </div>
                            <Badge
                              className="bg-[#F16869] text-white flex items-center w-fit"
                              variant="destructive"
                            >
                              {daysToExpiry <= 0 ? 'Expired' : 'Expiring Soon'}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>

                  {/* No Alerts */}
                  {lowStockCount === 0 && expiringCount === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p className="font-medium">All Good!</p>
                      <p className="text-sm">No alerts at this time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
