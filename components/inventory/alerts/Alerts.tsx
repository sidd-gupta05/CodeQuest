// components/inventory/alerts.tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, AlertCircle } from 'lucide-react';

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
  const lowStockItems = filteredInventory.filter((item) => {
    const status = getStockStatus(
      item.quantity,
      item.reorderThreshold,
      item.expiryDate
    );
    return status.status === 'low-stock' || status.status === 'out-of-stock';
  });

  const expiringItems = filteredInventory.filter((item) => {
    const status = getStockStatus(
      item.quantity,
      item.reorderThreshold,
      item.expiryDate
    );
    return status.status === 'expiring' || status.status === 'expired';
  });

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="text-3xl font-bold text-gray-900">
          Alerts & Notifications
        </CardTitle>
        <CardDescription className="font-medium text-gray-600 text-lg">
          Monitor stock levels and expiry dates
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-amber-500" />
                Low Stock Alerts
              </h3>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-200 font-semibold px-3 py-1"
              >
                {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}
              </Badge>
            </div>

            {lowStockCount > 0 ? (
              <div className="grid gap-3">
                {lowStockItems.map((item) => {
                  const reagent = getReagentDetails(item.reagentId);
                  const status = getStockStatus(
                    item.quantity,
                    item.reorderThreshold,
                    item.expiryDate
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-amber-25 shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="h-8 w-8 text-amber-500" />
                        <div>
                          <p className="font-bold text-gray-900">
                            {reagent?.name}
                          </p>
                          <p className="text-sm text-amber-700 font-medium">
                            Current stock: {item.quantity} {item.unit}
                            {item.reorderThreshold > 0 && (
                              <>
                                {' '}
                                • Threshold: {item.reorderThreshold} {item.unit}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500 text-white font-semibold px-3 py-1">
                        {status.status === 'out-of-stock'
                          ? 'Out of Stock'
                          : 'Reorder Required'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-dashed border-emerald-200">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-emerald-700">
                  No Low Stock Alerts
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  All reagents are sufficiently stocked
                </p>
              </div>
            )}
          </div>

          {/* Expiry Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-rose-500" />
                Expiry Alerts
              </h3>
              <Badge
                variant="destructive"
                className="bg-rose-100 text-rose-800 border-rose-200 font-semibold px-3 py-1"
              >
                {expiringCount} {expiringCount === 1 ? 'Item' : 'Items'}
              </Badge>
            </div>

            {expiringCount > 0 ? (
              <div className="grid gap-3">
                {expiringItems.map((item) => {
                  const reagent = getReagentDetails(item.reagentId);
                  const today = new Date();
                  const expiry = new Date(item.expiryDate);
                  const daysToExpiry = Math.ceil(
                    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isExpired = daysToExpiry <= 0;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-sm ${
                        isExpired
                          ? 'border-rose-300 bg-gradient-to-r from-rose-50 to-red-25'
                          : 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-25'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {isExpired ? (
                          <AlertCircle className="h-8 w-8 text-rose-500" />
                        ) : (
                          <Clock className="h-8 w-8 text-orange-500" />
                        )}
                        <div>
                          <p className="font-bold text-gray-900">
                            {reagent?.name}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isExpired ? 'text-rose-700' : 'text-orange-700'
                            }`}
                          >
                            Expires:{' '}
                            {new Date(item.expiryDate).toLocaleDateString()}
                            {isExpired
                              ? ' (EXPIRED)'
                              : ` (${daysToExpiry} day${daysToExpiry !== 1 ? 's' : ''} remaining)`}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`font-semibold px-3 py-1 ${
                          isExpired
                            ? 'bg-rose-500 text-white'
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {isExpired ? 'Expired' : 'Expiring Soon'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-dashed border-emerald-200">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-emerald-700">
                  No Expiry Alerts
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  All reagents are within safe expiry dates
                </p>
              </div>
            )}
          </div>

          {/* No Alerts State */}
          {lowStockCount === 0 && expiringCount === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 max-w-md mx-auto border-2 border-dashed border-emerald-200">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">
                  All Systems Normal!
                </h3>
                <p className="text-emerald-600 font-medium">
                  No alerts at this time
                </p>
                <p className="text-sm text-emerald-500 mt-2">
                  Your inventory is well-stocked and all items are within safe
                  dates.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
