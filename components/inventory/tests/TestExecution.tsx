<<<<<<< HEAD
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TestTube } from 'lucide-react';

// ---------- Types ----------
interface ReagentDetails {
  id: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  unit: string;
}

interface InventoryItem {
  id: string;
  labId: string;
  reagentId: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  reorderThreshold: number;
  batchNumber?: string;
}

interface TestItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration?: string;
  reagents: {
    reagentId: string;
    quantity: number;
    unit: string;
  }[];
}

=======

import React from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Activity, TestTube } from "lucide-react";

// ---------- Types ----------
import { InventoryItem, ReagentDetails, TestItem } from '@/types/inventory';
>>>>>>> 4aabe68 (modularization of inventory)
interface TestExecutionProps {
  sampleTestCatalog: TestItem[];
  inventory: InventoryItem[];
  selectedLab: string;
  loading: boolean;
  executeTest: (testId: string) => void | Promise<void>;
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
}

<<<<<<< HEAD
// ---------- Test Execution ----------
export function TestExecution({
  sampleTestCatalog,
  inventory,
  selectedLab,
  loading,
  executeTest,
  getReagentDetails,
}: TestExecutionProps) {
=======

// ---------- Test Execution ----------
export function TestExecution({ sampleTestCatalog, inventory, selectedLab, loading, executeTest, getReagentDetails }: TestExecutionProps) {
>>>>>>> 4aabe68 (modularization of inventory)
  return (
    <Card className="border-gray-100 ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Execute Tests</CardTitle>
        <CardDescription className="font-medium text-[#838FA2]">
          Perform tests and automatically deduct reagents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleTestCatalog.map((test) => {
            const canExecute = test.reagents.every((reagent) => {
              const inventoryItem = inventory.find(
<<<<<<< HEAD
                (item) =>
                  item.reagentId === reagent.reagentId &&
                  item.labId === selectedLab
              );
              return (
                inventoryItem && inventoryItem.quantity >= reagent.quantity
              );
            });

            return (
              <Card
                key={test.id}
                className={`${canExecute ? 'border-green-200' : 'border-red-200'}`}
              >
=======
                (item) => item.reagentId === reagent.reagentId && item.labId === selectedLab
              );
              return inventoryItem && inventoryItem.quantity >= reagent.quantity;
            });

            return (
              <Card key={test.id} className={`${canExecute ? "border-green-200" : "border-red-200"}`}>
>>>>>>> 4aabe68 (modularization of inventory)
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <Badge
<<<<<<< HEAD
                      className={
                        canExecute
                          ? 'bg-[#272E3F] text-white'
                          : 'bg-red-700 text-white'
                      }
                      variant={canExecute ? 'default' : 'destructive'}
                    >
                      {canExecute ? 'Ready' : 'Insufficient Stock'}
=======
                      className={canExecute ? "bg-[#272E3F] text-white" : "bg-red-700 text-white"}
                      variant={canExecute ? "default" : "destructive"}
                    >
                      {canExecute ? "Ready" : "Insufficient Stock"}
>>>>>>> 4aabe68 (modularization of inventory)
                    </Badge>
                  </div>
                  <CardDescription className="font-medium text-[#838FA2]">
                    {test.category} • {test.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
<<<<<<< HEAD
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
                        const hasSufficientStock = inventoryItem && inventoryItem.quantity >= reagent.quantity;
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between text-sm p-2 rounded ${
                              hasSufficientStock ? 'bg-green-50' : 'bg-red-50'
                            }`}
                          >
                            <span className="font-medium">{reagentDetails?.name || 'Unknown Reagent'}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">
                                {reagent.quantity} {reagent.unit}
                              </span>
                              {inventoryItem && (
                                <span className={`text-xs ${
                                  hasSufficientStock ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  (Available: {inventoryItem.quantity} {inventoryItem.unit})
                                </span>
                              )}
                            </div>
=======
                      <h4 className="font-bold text-sm">Reagent Consumption:</h4>
                      {test.reagents.map((reagent, index) => {
                        const reagentDetails = getReagentDetails(reagent.reagentId);
                        const inventoryItem = inventory.find(
                          (item) => item.reagentId === reagent.reagentId && item.labId === selectedLab
                        );
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{reagentDetails?.name}</span>
                            <span className="text-gray-600">
                              -{reagent.quantity} {reagent.unit}
                              {inventoryItem && (
                                <span className="ml-2 text-xs">
                                  (Available: {inventoryItem.quantity} {inventoryItem.unit})
                                </span>
                              )}
                            </span>
>>>>>>> 4aabe68 (modularization of inventory)
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      className="w-full hover:bg-[#272E3F] text-white bg-[#1e2530]"
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
  );
}