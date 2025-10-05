import React from 'react';
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
import { InventoryItem, ReagentDetails, TestItem } from '@/types/inventory';
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
  );
}
