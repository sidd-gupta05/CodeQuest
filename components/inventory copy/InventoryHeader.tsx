import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function InventoryHeader({
  lowStockCount,
  expiringCount,
}: {
  lowStockCount: number;
  expiringCount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
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
  );
}
