//components/inventory/InventoryHeader.tsx
import { Bell, Settings, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function InventoryHeader({
  lowStockCount,
  expiringCount,
  totalReagents,
  averageStockLevel,
  onAlertClick,
}: {
  lowStockCount: number;
  expiringCount: number;
  totalReagents?: number;
  averageStockLevel?: number;
  onAlertClick?: () => void;
}) {
  const totalAlerts = lowStockCount + expiringCount;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Dashboard
          </h1>
          {totalReagents && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm font-medium px-3 py-1">
              {totalReagents} Items
            </Badge>
          )}
        </div>
        <p className="text-gray-600 text-lg">
          Manage your lab reagents, track stock levels, and monitor test
          execution
        </p>
        {averageStockLevel && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Average stock: {averageStockLevel} units</span>
            <span>•</span>
            <span
              className={
                totalAlerts > 0
                  ? 'text-amber-600 font-medium'
                  : 'text-emerald-600 font-medium'
              }
            >
              {totalAlerts} active alerts
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button> */}

        <Button
          className="relative bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-xl transition-colors"
          variant="outline"
          size="icon"
          onClick={onAlertClick}
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {totalAlerts > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
              {totalAlerts}
            </Badge>
          )}
        </Button>
        {/* <Button
          variant="outline"
          size="icon"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 p-3 rounded-xl"
        >
          <Settings className="h-5 w-5" />
        </Button> */}
      </div>
    </div>
  );
}
