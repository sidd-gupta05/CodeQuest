import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

// ---------- Types ----------
import { InventoryItem, ReagentDetails } from '@/types/inventory';
interface AlertsProps {
  filteredInventory: InventoryItem[];
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
  getStockStatus: (
    quantity: number,
    threshold: number,
    expiry: string
  ) => { status: string; color: string; icon: React.ElementType };
  lowStockCount: number;
  expiringCount: number;
}

// ---------- Alerts ----------
export function Alerts({
  filteredInventory,
  getReagentDetails,
  getStockStatus,
  lowStockCount,
  expiringCount,
}: AlertsProps) {
  return (
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
            <h3 className="font-medium text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
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
                        Current stock: {item.quantity} {item.unit} (Threshold:{' '}
                        {item.reorderThreshold} {item.unit})
                      </p>
                    </div>
                    <Badge variant="secondary">Reorder Required</Badge>
                  </div>
                );
              })}
          </div>

          {/* Expiry Alerts */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-red-500" /> Expiry Alerts
            </h3>
            {filteredInventory
              .filter((item) => {
                const status = getStockStatus(
                  item.quantity,
                  item.reorderThreshold,
                  item.expiryDate
                );
                return (
                  status.status === 'expiring' || status.status === 'expired'
                );
              })
              .map((item) => {
                const reagent = getReagentDetails(item.reagentId);
                const today = new Date();
                const expiry = new Date(item.expiryDate);
                const daysToExpiry = Math.ceil(
                  (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
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
                      className="bg-[#F16869] text-white"
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
  );
}
