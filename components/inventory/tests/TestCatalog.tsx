import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

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

interface TestCatalogProps {
  sampleTestCatalog: TestItem[];
  inventory: InventoryItem[];
  selectedLab: string;
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
}

// ---------- Test Catalog ----------
export function TestCatalog({
  sampleTestCatalog,
  inventory,
  selectedLab,
  getReagentDetails,
}: TestCatalogProps) {
  return (
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
          {sampleTestCatalog.map((test) => {
            const allReagentsAvailable = test.reagents.every((reagent) => {
              const inventoryItem = inventory.find(
                (item) =>
                  item.reagentId === reagent.reagentId &&
                  item.labId === selectedLab
              );
              return inventoryItem && inventoryItem.quantity >= reagent.quantity;
            });

            return (
              <Card
                key={test.id}
                className={`border-l-4 ${
                  allReagentsAvailable 
                    ? 'border-l-green-500' 
                    : 'border-l-red-500'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className="bg-[#F3F6FA] border-gray-100"
                        variant="outline"
                      >
                        {test.category}
                      </Badge>
                      <Badge
                        variant={allReagentsAvailable ? "default" : "destructive"}
                        className={
                          allReagentsAvailable 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }
                      >
                        {allReagentsAvailable ? 'Ready' : 'Insufficient Stock'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="font-medium text-[#838FA2]">
                    {test.description && (
                      <p className="mb-1">{test.description}</p>
                    )}
                    Duration: {test.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Required Reagents:</h4>
                    {test.reagents.map((reagent, index) => {
                      const reagentDetails = getReagentDetails(reagent.reagentId);
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
                          className="flex items-center justify-between text-sm p-2 rounded bg-gray-50"
                        >
                          <div>
                            <span className="font-medium">{reagentDetails?.name || 'Unknown Reagent'}</span>
                            <div className="text-xs text-gray-500">
                              {reagentDetails?.category}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              {reagent.quantity} {reagent.unit}
                            </span>
                            {inventoryItem && (
                              <span className={`text-xs ${
                                available ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ({inventoryItem.quantity} {inventoryItem.unit} available)
                              </span>
                            )}
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}