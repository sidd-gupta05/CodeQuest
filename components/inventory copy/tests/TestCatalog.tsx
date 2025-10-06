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
import { InventoryItem, ReagentDetails, TestItem } from '@/types/inventory';
interface TestCatalogProps {
  sampleTestCatalog: TestItem[];
  inventory: InventoryItem[];
  selectedLab: string;
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
  onTestExecuted: (result: any) => void;
  onAlertTriggered: (alerts: any[]) => void;
}

// ---------- Test Catalog ----------
export function TestCatalog({
  sampleTestCatalog,
  inventory,
  selectedLab,
  getReagentDetails,
  onTestExecuted,
  onAlertTriggered,
}: TestCatalogProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const executeTest = async (testId: string) => {
    if (!selectedBooking || !selectedPatient) {
      alert('Please select a booking and patient');
      return;
    }

    setLoading(testId);

    try {
      const response = await fetch(
        `/api/lab/${selectedLab}/tests/${testId}/execute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: selectedBooking,
            patientId: selectedPatient,
            quantity: 1,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      // Notify parent component about successful execution
      onTestExecuted(result);

      // Trigger alerts if any
      if (result.lowStockAlerts && result.lowStockAlerts.length > 0) {
        onAlertTriggered(result.lowStockAlerts);
      }

      // Show success message
      alert(
        `Test executed successfully! ${result.lowStockAlerts?.length ? 'Low stock alerts triggered.' : ''}`
      );
    } catch (error) {
      console.error('Error executing test:', error);
      alert(error instanceof Error ? error.message : 'Failed to execute test');
    } finally {
      setLoading(null);
    }
  };

  const canExecuteTest = (test: TestItem) => {
    return test.reagents.every((reagent) => {
      const inventoryItem = inventory.find(
        (item) =>
          (item.reagentId === reagent.reagentId ||
            item.customReagentId === reagent.reagentId) &&
          item.labId === selectedLab
      );
      return inventoryItem && inventoryItem.quantity >= reagent.quantity;
    });
  };

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
