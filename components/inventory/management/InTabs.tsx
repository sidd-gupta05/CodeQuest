<<<<<<< HEAD
// import React, { useState } from 'react';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Skeleton } from '@/components/ui/skeleton';
// import {
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ArrowUp,
//   ArrowDown,
// } from 'lucide-react';

// // ---------- Types ----------
// interface ReagentDetails {
//   id: string;
//   name: string;
//   category?: string;
//   description?: string;
//   manufacturer?: string;
//   unit: string;
// }

// interface InventoryItem {
//   id: string;
//   labId: string;
//   reagentId: string;
//   quantity: number;
//   unit: string;
//   expiryDate: string;
//   reorderThreshold: number;
//   batchNumber?: string;
// }

// interface InTabsProps {
//   loading: boolean;
//   filteredInventory: InventoryItem[];
//   sampleReagentCatalog: ReagentDetails[];
// }

// export const InTabs = ({
//   loading,
//   filteredInventory,
//   sampleReagentCatalog,
// }: InTabsProps) => {
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: 'ascending' | 'descending';
//   } | null>(null);

//   // Get reagent details by ID
//   const getReagentDetails = (reagentId: string) => {
//     return sampleReagentCatalog.find((r) => r.id === reagentId);
//   };

//   // Calculate stock status
//   const getStockStatus = (
//     quantity: number,
//     threshold: number,
//     expiryDate: string
//   ) => {
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const daysToExpiry = Math.ceil(
//       (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     if (expiryDate && daysToExpiry <= 0)
//       return {
//         status: 'expired',
//         color: 'destructive',
//         icon: XCircle,
//         sortValue: 1,
//       };
//     if (expiryDate && daysToExpiry <= 7)
//       return {
//         status: 'expiring',
//         color: 'destructive',
//         icon: AlertCircle,
//         sortValue: 2,
//       };
//     if (quantity <= 0)
//       return {
//         status: 'out-of-stock',
//         color: 'destructive',
//         icon: XCircle,
//         sortValue: 3,
//       };
//     if (threshold > 0 && quantity <= threshold)
//       return {
//         status: 'low-stock',
//         color: 'secondary',
//         icon: AlertTriangle,
//         sortValue: 4,
//       };
//     return {
//       status: 'good',
//       color: 'default',
//       icon: CheckCircle,
//       sortValue: 5,
//     };
//   };

//   const sortedInventory = [...filteredInventory].sort((a, b) => {
//     if (!sortConfig) {
//       return 0;
//     }

//     if (sortConfig.key === 'quantity') {
//       const quantityA = a.quantity;
//       const quantityB = b.quantity;
//       if (quantityA < quantityB) {
//         return sortConfig.direction === 'ascending' ? -1 : 1;
//       }
//       if (quantityA > quantityB) {
//         return sortConfig.direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     }

//     if (sortConfig.key === 'status') {
//       const statusA = getStockStatus(
//         a.quantity,
//         a.reorderThreshold,
//         a.expiryDate
//       ).sortValue;
//       const statusB = getStockStatus(
//         b.quantity,
//         b.reorderThreshold,
//         b.expiryDate
//       ).sortValue;
//       if (statusA < statusB) {
//         return sortConfig.direction === 'ascending' ? 1 : -1;
//       }
//       if (statusA > statusB) {
//         return sortConfig.direction === 'ascending' ? -1 : 1;
//       }
//       return 0;
//     }

//     return 0;
//   });

//   const requestSort = (key: string) => {
//     let direction: 'ascending' | 'descending' = 'ascending';
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getArrowIcon = (key: string) => {
//     if (sortConfig?.key === key) {
//       if (sortConfig.direction === 'ascending') {
//         return <ArrowUp className="ml-2 h-4 w-4 inline text-green-500" />;
//       }
//       return <ArrowDown className="ml-2 h-4 w-4 inline text-red-500" />;
//     }
//     return (
//       <>
//         <ArrowUp className="ml-2 h-4 w-4 inline text-green-500 opacity-20 hover:opacity-100" />
//         <ArrowDown className="h-4 w-4 inline text-red-500 opacity-20 hover:opacity-100" />
//       </>
//     );
//   };

//   return (
//     <>
//       <div className="rounded-md border-[#828EA2]">
//         <Table>
//           <TableHeader className="border-[#e8e8e9] text-md text-[#828EA2] font-semibold">
//             <TableRow className="border-[#e8e8e9]">
//               <TableHead>Reagent</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead
//                 className="cursor-pointer"
//                 onClick={() => requestSort('quantity')}
//               >
//                 Stock {getArrowIcon('quantity')}
//               </TableHead>
//               <TableHead
//                 className="cursor-pointer"
//                 onClick={() => requestSort('status')}
//               >
//                 Status {getArrowIcon('status')}
//               </TableHead>
//               <TableHead>Expiry</TableHead>
//               <TableHead>Batch</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading
//               ? Array.from({ length: 5 }).map((_, i) => (
//                   <TableRow className="hover:bg-[#F8FAFC]" key={i}>
//                     <TableCell>
//                       <Skeleton className="h-4 w-32 " />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-24 " />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-16 " />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-6 w-20 " />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-20 " />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-24 " />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               : sortedInventory.map((item) => {
//                   const reagent = getReagentDetails(item.reagentId);
//                   const stockStatus = getStockStatus(
//                     item.quantity,
//                     item.reorderThreshold,
//                     item.expiryDate
//                   );
//                   const StatusIcon = stockStatus.icon;

//                   return (
//                     <TableRow
//                       className="hover:bg-[#F8FAFC] border-[#e8e8e9]"
//                       key={item.id}
//                     >
//                       <TableCell className="font-medium ">
//                         {reagent?.name || 'Unknown Reagent'}
//                       </TableCell>
//                       <TableCell>
//                         {reagent?.category || 'Uncategorized'}
//                       </TableCell>
//                       <TableCell>
//                         {item.quantity} {item.unit}
//                         {item.reorderThreshold > 0 &&
//                           item.quantity <= item.reorderThreshold && (
//                             <Badge
//                               variant="secondary"
//                               className="ml-2 bg-[#F3F6FA]"
//                             >
//                               Low
//                             </Badge>
//                           )}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             stockStatus.color as
//                               | 'destructive'
//                               | 'secondary'
//                               | 'default'
//                               | 'outline'
//                               | undefined
//                           }
//                           className={`${
//                             stockStatus.status === 'good'
//                               ? 'bg-green-500 text-white'
//                               : stockStatus.status === 'low-stock'
//                                 ? 'bg-orange-500 text-white'
//                                 : 'bg-[#F16869] text-white'
//                           } flex items-center w-fit`}
//                         >
//                           <StatusIcon className="h-3 w-3 mr-1" />
//                           {stockStatus.status.replace('-', ' ')}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="font-mono text-sm font-black">
//                         {item.expiryDate
//                           ? new Date(item.expiryDate).toLocaleDateString()
//                           : 'No expiry'}
//                       </TableCell>
//                       <TableCell className="font-mono text-sm">
//                         {item.batchNumber || 'N/A'}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//           </TableBody>
//         </Table>
//       </div>
//     </>
//   );
// };

import React, { useState } from 'react';
=======
import React from 'react';
>>>>>>> 8f4a36f (inventory components)
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
<<<<<<< HEAD
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

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
=======
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type InventoryItem = {
>>>>>>> 8f4a36f (inventory components)
  id: string;
  labId: string;
  reagentId: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  reorderThreshold: number;
<<<<<<< HEAD
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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

=======
  batchNumber: string;
};
interface ReagentProps {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
}

const InTabs = ({
  loading,
  filteredInventory,
  sampleReagentCatalog,
}: {
  loading: boolean;
  filteredInventory: InventoryItem[];
  sampleReagentCatalog: ReagentProps[];
}) => {
>>>>>>> 8f4a36f (inventory components)
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

<<<<<<< HEAD
    if (expiryDate && daysToExpiry <= 0)
      return {
        status: 'expired',
        color: 'destructive',
        icon: XCircle,
        sortValue: 1,
      };
    if (expiryDate && daysToExpiry <= 7)
      return {
        status: 'expiring',
        color: 'destructive',
        icon: AlertCircle,
        sortValue: 2,
      };
    if (quantity <= 0)
      return {
        status: 'out-of-stock',
        color: 'destructive',
        icon: XCircle,
        sortValue: 3,
      };
    if (threshold > 0 && quantity <= threshold)
      return {
        status: 'low-stock',
        color: 'secondary',
        icon: AlertTriangle,
        sortValue: 4,
      };
    return {
      status: 'good',
      color: 'default',
      icon: CheckCircle,
      sortValue: 5,
    };
  };

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (!sortConfig) {
      return 0;
    }

    if (sortConfig.key === 'quantity') {
      const quantityA = a.quantity;
      const quantityB = b.quantity;
      if (quantityA < quantityB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (quantityA > quantityB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }

    if (sortConfig.key === 'status') {
      const statusA = getStockStatus(
        a.quantity,
        a.reorderThreshold,
        a.expiryDate
      ).sortValue;
      const statusB = getStockStatus(
        b.quantity,
        b.reorderThreshold,
        b.expiryDate
      ).sortValue;
      if (statusA < statusB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      if (statusA > statusB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      return 0;
    }

    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getArrowIcon = (key: string) => {
    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'ascending') {
        return <ArrowUp className="ml-2 h-4 w-4 inline text-green-500" />;
      }
      return <ArrowDown className="ml-2 h-4 w-4 inline text-red-500" />;
    }
    return (
      <>
        <ArrowUp className="ml-2 h-4 w-4 inline text-green-500 opacity-20 hover:opacity-100" />
        <ArrowDown className="h-4 w-4 inline text-red-500 opacity-20 hover:opacity-100" />
      </>
    );
=======
    if (daysToExpiry <= 0)
      return { status: 'expired', color: 'destructive', icon: XCircle };
    if (daysToExpiry <= 7)
      return { status: 'expiring', color: 'destructive', icon: AlertCircle };
    if (quantity <= 0)
      return { status: 'out-of-stock', color: 'destructive', icon: XCircle };
    if (quantity <= threshold)
      return { status: 'low-stock', color: 'secondary', icon: AlertTriangle };
    return { status: 'good', color: 'default', icon: CheckCircle };
>>>>>>> 8f4a36f (inventory components)
  };

  return (
    <>
      <div className="rounded-md border-[#828EA2]">
<<<<<<< HEAD
        <Table>
=======
        <Table className="">
>>>>>>> 8f4a36f (inventory components)
          <TableHeader className="border-[#e8e8e9] text-md text-[#828EA2] font-semibold">
            <TableRow className="border-[#e8e8e9]">
              <TableHead>Reagent</TableHead>
              <TableHead>Category</TableHead>
<<<<<<< HEAD
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('quantity')}
              >
                Stock {getArrowIcon('quantity')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('status')}
              >
                Status {getArrowIcon('status')}
              </TableHead>
              <TableHead>Expiry</TableHead>
=======
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              {/* <TableHead>Location</TableHead> */}
>>>>>>> 8f4a36f (inventory components)
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
<<<<<<< HEAD
=======
                      <Skeleton className="h-4 w-16 " />
                    </TableCell>
                    <TableCell>
>>>>>>> 8f4a36f (inventory components)
                      <Skeleton className="h-4 w-24 " />
                    </TableCell>
                  </TableRow>
                ))
<<<<<<< HEAD
              : sortedInventory.map((item) => {
=======
              : filteredInventory.map((item) => {
>>>>>>> 8f4a36f (inventory components)
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
<<<<<<< HEAD
                        {reagent?.name || 'Unknown Reagent'}
                      </TableCell>
                      <TableCell>
                        {reagent?.category || 'Uncategorized'}
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                        {item.reorderThreshold > 0 &&
                          item.quantity <= item.reorderThreshold && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-[#F3F6FA]"
                            >
                              Low
                            </Badge>
                          )}
=======
                        {reagent?.name}
                      </TableCell>
                      <TableCell>{reagent?.category}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                        {item.quantity <= item.reorderThreshold && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-[#F3F6FA]"
                          >
                            Low
                          </Badge>
                        )}
>>>>>>> 8f4a36f (inventory components)
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
<<<<<<< HEAD
                          className={`${
                            stockStatus.status === 'good'
                              ? 'bg-green-500 text-white'
                              : stockStatus.status === 'low-stock'
                                ? 'bg-orange-500 text-white'
                                : 'bg-[#F16869] text-white'
                          } flex items-center w-fit`}
=======
                          className="bg-[#F16869] text-white flex items-center w-fit"
>>>>>>> 8f4a36f (inventory components)
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {stockStatus.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-black">
<<<<<<< HEAD
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString()
                          : 'No expiry'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.batchNumber || 'N/A'}
=======
                        {item.expiryDate}
                      </TableCell>
                      {/* <TableCell>{item.location}</TableCell> */}
                      <TableCell className="font-mono text-sm">
                        {item.batchNumber}
>>>>>>> 8f4a36f (inventory components)
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
<<<<<<< HEAD
=======

export default InTabs;
>>>>>>> 8f4a36f (inventory components)
