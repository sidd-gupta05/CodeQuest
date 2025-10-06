import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

interface InTabsProps {
  loading: boolean;
  filteredInventory: InventoryItem[];
  sampleReagentCatalog: ReagentDetails[];
}

export const InTabs = ({
  loading,
  filteredInventory,
  sampleReagentCatalog,
}: InTabsProps) => {
  // Get reagent details by ID
  const getReagentDetails = (reagentId: string) => {
    return sampleReagentCatalog.find((r) => r.id === reagentId);
  };

  // Calculate stock status
  const getStockStatus = (
    quantity: number,
    threshold: number,
    expiryDate: string
  ) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (expiryDate && daysToExpiry <= 0)
      return { status: 'expired', color: 'destructive', icon: XCircle };
    if (expiryDate && daysToExpiry <= 7)
      return { status: 'expiring', color: 'destructive', icon: AlertCircle };
    if (quantity <= 0)
      return { status: 'out-of-stock', color: 'destructive', icon: XCircle };
    if (threshold > 0 && quantity <= threshold)
      return { status: 'low-stock', color: 'secondary', icon: AlertTriangle };
    return { status: 'good', color: 'default', icon: CheckCircle };
  };

  return (
    <>
      <div className="rounded-md border-[#828EA2]">
        <Table>
          <TableHeader className="border-[#e8e8e9] text-md text-[#828EA2] font-semibold">
            <TableRow className="border-[#e8e8e9]">
              <TableHead>Reagent</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
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
                        {reagent?.name || 'Unknown Reagent'}
                      </TableCell>
                      <TableCell>{reagent?.category || 'Uncategorized'}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                        {item.reorderThreshold > 0 && item.quantity <= item.reorderThreshold && (
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
                          variant={
                            stockStatus.color as
                              | 'destructive'
                              | 'secondary'
                              | 'default'
                              | 'outline'
                              | undefined
                          }
                          className={`${
                            stockStatus.status === 'good' 
                              ? 'bg-green-500 text-white' 
                              : stockStatus.status === 'low-stock'
                              ? 'bg-orange-500 text-white'
                              : 'bg-[#F16869] text-white'
                          } flex items-center w-fit`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {stockStatus.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-black">
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No expiry'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.batchNumber || 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};