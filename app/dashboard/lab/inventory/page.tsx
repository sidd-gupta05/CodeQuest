//app/dashboard/lab/inventory/page.tsx
'use client';
import React, { useState } from 'react';
import { interFont } from '@/app/fonts';
<<<<<<< HEAD
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  PackageOpen,
} from 'lucide-react';
=======
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
>>>>>>> bc84cb0 (final components)

import { sampleTestCatalog, sampleReagentCatalog, sampleLabInventory, sampleCustomReagents } from '@/types/metadata';

// const Inventory = () => {
//   const [pageLoading, setPageLoading] = useState(true);
//   const [inventory, setInventory] = useState<string[]>([]);

//   // useEffect(() => {
//   //   // Simulating API call instead of setTimeout
//   //   const fetchInventory = async () => {
//   //     try {
//   //       const res = await fetch("/api/inventory"); // replace with real endpoint
//   //       const data = await res.json();
//   //       setInventory(data.items);
//   //     } catch (err) {
//   //       console.error("Error fetching inventory", err);
//   //     } finally {
//   //       setPageLoading(false); // set loading false once data fetched
//   //     }
//   //   };

//   //   fetchInventory();
//   // }, []);

//   useEffect(() => { const timer = setTimeout(() => { setPageLoading(false); }, 1000); return () => clearTimeout(timer); }, []);

//   if (pageLoading) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 items-center justify-center">
//         <div className="text-center">
//           {/* Better: use animated SVG/WebM instead of GIF */}
//           <video
//             src="/inventory.webm"
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="mx-auto w-24 h-24"
//           />
//           <p className="mt-4 text-gray-600">Loading inventory...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold">Inventory</h1>
//       <div className="mt-4">
//         {inventory.length === 0 ? (
//           <p>No items found.</p>
//         ) : (
//           <ul className="list-disc pl-5">
//             {inventory.map((item, idx) => (
//               <li key={idx}>{item}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

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

  // Real test execution with API
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
  // const [inventory, setInventory] = useState<string[]>([]);

  // useEffect(() => {
  //   // Simulating API call instead of setTimeout
  //   const fetchInventory = async () => {
  //     try {
  //       const res = await fetch("/api/inventory"); // replace with real endpoint
  //       const data = await res.json();
  //       setInventory(data.items);
  //     } catch (err) {
  //       console.error("Error fetching inventory", err);
  //     } finally {
  //       setPageLoading(false); // set loading false once data fetched
  //     }
  //   };

  //   fetchInventory();
  // }, []);

  // useEffect(() => { const timer = setTimeout(() => { setPageLoading(false); }, 1000); return () => clearTimeout(timer); }, []);

  // if (pageLoading) {
  //   return (
  //     <div className="flex min-h-screen bg-gray-50 items-center justify-center">
  //       <div className="text-center">
  //         {/* Better: use animated SVG/WebM instead of GIF */}
  //         <video
  //           src="/inventory.webm"
  //           autoPlay
  //           loop
  //           muted
  //           playsInline
  //           className="mx-auto w-24 h-24"
  //         />
  //         <p className="mt-4 text-gray-600">Loading inventory...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ` + interFont.className}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
<<<<<<< HEAD
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
            {/* <p className="text-gray-600">
              Multi-tenant Lab Inventory Management System
            </p> */}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              className="relative bg-white border border-gray-300 p-5"
              variant="outline"
              size="icon"
            >
              <Bell className="h-8 w-8" />
              {lowStockCount + expiringCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-red-500 text-white flex items-center justify-center text-xs">
                  {lowStockCount + expiringCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-[#F7F8F9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-[500px]">
                Total Reagents
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground font-[#F7F8F9]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light">{totalReagents}</div>
              <p className="text-xs font-normal text-[#64748B] text-muted-foreground">
                Active inventory items
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#F7F8F9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-[500px]">
                Low Stock Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-orange-600">
                {lowStockCount}
              </div>
              <p className="text-xs font-normal text-[#64748B] text-muted-foreground">
                Require reordering
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#F7F8F9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-[500px]">
                Expiring Soon
              </CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-red-600">
                {expiringCount}
              </div>
              <p className="text-xs font-normal text-[#64748B] text-muted-foreground">
                Within 7 days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#F7F8F9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-[500px]">
                Tests Available
              </CardTitle>
              <TestTube className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-green-600">
                {sampleTestCatalog.length}
              </div>
              <p className="text-xs font-normal text-[#64748B] text-muted-foreground">
                Ready to execute
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-[#F1F5F9] text-[#64748B]">
            <TabsTrigger
              className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
              value="inventory"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
              value="tests"
            >
              Test Catalog
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
              value="execute"
            >
              Execute Tests
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
              value="custom"
            >
              Custom Reagents
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#F7F8F9] data-[state=active]:text-black"
              value="alerts"
            >
              Alerts
            </TabsTrigger>
          </TabsList>
=======
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
>>>>>>> bc84cb0 (final components)

          {/* Inventory Management */}
          <TabsContent
            value="inventory"
            className="space-y-6 bg-white border border-[#F7F8F9] p-4 rounded-md"
          >
            <Card className="bg-white border-[#F7F8F9]">
<<<<<<< HEAD
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      Reagent Inventory
                    </CardTitle>
                    <CardDescription className="text-[#64748B] font-normal">
                      Manage stock levels and track expiry dates
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0F172A] text-white hover:bg-[#272E3F] p-6 text-md">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={`${interFont.className} bg-white border-[#F7F8F9] max-w-lg`}
                    >
                      <DialogHeader>
                        <DialogTitle className="font-semibold text-xl">
                          Add Reagent Stock
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">{`Add new stock for existing reagents`}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 border-[#F7F8F9]">
                        <div>
                          <Label className="pb-1 text-md" htmlFor="reagent">
                            Reagent
                          </Label>
                          <Select>
                            <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                              <SelectValue
                                className="border-[#F7F8F9] text-lg"
                                placeholder="Select reagent"
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                              {sampleReagentCatalog.map((reagent) => (
                                <SelectItem
                                  className="hover:bg-gray-200 text-sm pl-3 "
                                  key={reagent.id}
                                  value={reagent.id}
                                >
                                  {reagent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="pb-1 text-md" htmlFor="quantity">
                              Quantity
                            </Label>
                            <Input
                              className="p-4 py-5 text-md border-[#dbdcdd]"
                              id="quantity"
                              type="number"
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <Label className="pb-1 text-md" htmlFor="unit">
                              Unit
                            </Label>
                            <Select>
                              <SelectTrigger className="border-[#dbdcdd] p-4 py-5 text-md">
                                <SelectValue
                                  className="p-4 py-5 text-md"
                                  placeholder="ml"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#dbdcdd]">
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
                            className="border-[#dbdcdd]  text-md"
                            id="expiry"
                            type="date"
                          />
                        </div>
                        <div>
                          <Label className="pb-1 text-md" htmlFor="batch">
                            Batch Number
                          </Label>
                          <Input
                            className="border-[#dbdcdd] p-4 py-5 text-md"
                            id="batch"
                            placeholder="BATCH2024001"
                          />
                        </div>
                        {/* <div>
                          <Label htmlFor="location">Storage Location</Label>
                          <Input id="location" placeholder="Fridge A-1" />
                        </div> */}
                        <Button className="w-full bg-black text-white cursor-pointer hover:bg-gray-800">
                          Add to Inventory
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 " />
                    <Input
                      placeholder="Search reagents or batch numbers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#e8e8e9]"
                    />
                  </div>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-48 border-[#e8e8e9]">
                      <Filter className="h-4 w-4 mr-2 border-[#e8e8e9]" />
                      <SelectValue className="border-[#e8e8e9]" />
                    </SelectTrigger>
                    <SelectContent className="border-[#e8e8e9] bg-white">
                      <SelectItem className="hover:bg-gray-200" value="all">
                        All Categories
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-gray-200"
                        value="Hematology"
                      >
                        Hematology
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-gray-200"
                        value="Molecular"
                      >
                        Molecular
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-gray-200"
                        value="Clinical Chemistry"
                      >
                        Clinical Chemistry
                      </SelectItem>
                      <SelectItem className="hover:bg-gray-200" value="General">
                        General
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border-[#828EA2]">
                  <Table className="">
                    <TableHeader className="border-[#e8e8e9] text-md text-[#828EA2] font-semibold">
                      <TableRow className="border-[#e8e8e9]">
                        <TableHead>Reagent</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expiry</TableHead>
                        {/* <TableHead>Location</TableHead> */}
                        <TableHead>Batch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow className="hover:bg-[#F8FAFC]" key={i}>
                              <TableCell>
                                <Skeleton className="h-4 w-32 " />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24 " />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16 " />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-6 w-20 " />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20 " />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16 " />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24 " />
                              </TableCell>
                            </TableRow>
                          ))
                        : filteredInventory.map((item) => {
                            const reagent = getReagentDetails(item.reagentId);
                            const stockStatus = getStockStatus(
                              item.quantity,
                              item.reorderThreshold,
                              item.expiryDate
                            );
                            const StatusIcon = stockStatus.icon;

                            return (
                              <TableRow
                                className="hover:bg-[#F8FAFC] border-[#e8e8e9]"
                                key={item.id}
                              >
                                <TableCell className="font-medium ">
                                  {reagent?.name}
                                </TableCell>
                                <TableCell>{reagent?.category}</TableCell>
                                <TableCell>
                                  {item.quantity} {item.unit}
                                  {item.quantity <= item.reorderThreshold && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 bg-[#F3F6FA]"
                                    >
                                      Low
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={stockStatus.color as any}
                                    className="bg-[#F16869] text-white flex items-center w-fit"
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {stockStatus.status.replace('-', ' ')}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm font-black">
                                  {item.expiryDate}
                                </TableCell>
                                {/* <TableCell>{item.location}</TableCell> */}
                                <TableCell className="font-mono text-sm">
                                  {item.batchNumber}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </div>
=======
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
>>>>>>> bc84cb0 (final components)
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
<<<<<<< HEAD
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
                              {/* <div>
                              <span className="font-medium">Location:</span>
                              <p>{reagent.location}</p>
                            </div> */}
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
=======
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
>>>>>>> bc84cb0 (final components)
      </div>
    </div>
  );
};

export default Inventory;