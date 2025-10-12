// components/inventory/test-execution.tsx
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
import { Activity, TestTube, Clock } from 'lucide-react';

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

interface TestExecutionProps {
  sampleTestCatalog: TestItem[];
  inventory: InventoryItem[];
  selectedLab: string;
  loading: boolean;
  executeTest: (testId: string) => void | Promise<void>;
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
}

// ---------- Test Execution ----------
export function TestExecution({
  sampleTestCatalog,
  inventory,
  selectedLab,
  loading,
  executeTest,
  getReagentDetails,
}: TestExecutionProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="text-3xl font-bold text-gray-900">
          Execute Tests
        </CardTitle>
        <CardDescription className="font-medium text-gray-600 text-lg">
          Perform tests and automatically deduct reagents
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleTestCatalog.map((test) => {
            const canExecute = test.reagents.every((reagent) => {
              const inventoryItem = inventory.find(
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
                className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden ${
                  canExecute
                    ? 'border-l-4 border-l-emerald-500'
                    : 'border-l-4 border-l-rose-500'
                }`}
              >
                <CardHeader className="pb-4 bg-gradient-to-r from-white to-gray-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {test.name}
                    </CardTitle>
                    <Badge
                      className={`font-semibold px-3 py-1 ${
                        canExecute
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-rose-500 text-white shadow-sm'
                      }`}
                      variant={canExecute ? 'default' : 'destructive'}
                    >
                      {canExecute ? 'Ready' : 'Insufficient Stock'}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium text-gray-600 flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {test.category}
                    </Badge>
                    <span className="flex items-center text-sm font-semibold">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.duration}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
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
                        const hasSufficientStock =
                          inventoryItem &&
                          inventoryItem.quantity >= reagent.quantity;

                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${
                              hasSufficientStock
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-rose-50 border-rose-200'
                            }`}
                          >
                            <span className="font-semibold text-gray-900">
                              {reagentDetails?.name || 'Unknown Reagent'}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-md border">
                                {reagent.quantity} {reagent.unit}
                              </span>
                              {inventoryItem && (
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    hasSufficientStock
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  Available: {inventoryItem.quantity}{' '}
                                  {inventoryItem.unit}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                        canExecute
                          ? 'bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!canExecute || loading}
                      onClick={() => executeTest(test.id)}
                    >
                      {loading ? (
                        <>
                          <Activity className="h-5 w-5 mr-2 animate-spin" />
                          Executing Test...
                        </>
                      ) : (
                        <>
                          <TestTube className="h-5 w-5 mr-2" />
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
