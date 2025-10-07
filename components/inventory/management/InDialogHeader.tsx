// components/inventory/in-dialog-header.tsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { NextFont } from 'next/dist/compiled/@next/font';
import * as XLSX from 'xlsx';
import  ExcelJS from 'exceljs';

interface ReagentCatalog {
  id: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  unit: string;
}

interface CustomReagent {
  id: string;
  labId: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  unit: string;
}

interface DialogHeaderProps {
  font: NextFont;
  reagentCatalog: ReagentCatalog[];
  customReagents: CustomReagent[];
  selectedLab: string;
  onReagentAdded: () => void;
}

export const InDialogHeader = ({
  font,
  reagentCatalog,
  customReagents,
  selectedLab,
  onReagentAdded
}: DialogHeaderProps) => {
  const [reagentType, setReagentType] = React.useState<'catalog' | 'custom'>('catalog');
  const [selectedReagentId, setSelectedReagentId] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [batchNumber, setBatchNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const availableReagents = reagentType === 'catalog' ? reagentCatalog : customReagents;
  const selectedReagent = availableReagents.find(reagent => reagent.id === selectedReagentId);


// Add this useEffect to reset selected reagent when type changes
useEffect(() => {
  setSelectedReagentId('');
  setBatchNumber('');
  setQuantity('');
  setExpiryDate('');
}, [reagentType]);

// Then modify your existing batch fetch useEffect to check if the selected reagent exists
useEffect(() => {
  const fetchExistingBatch = async () => {
    // Check if selected reagent exists in available reagents
    const reagentExists = availableReagents.some(reagent => reagent.id === selectedReagentId);
    
    if (selectedReagentId && reagentExists) {
      try {
        // Build query parameters based on reagent type
        const params = new URLSearchParams();
        if (reagentType === 'catalog') {
          params.append('reagentId', selectedReagentId);
        } else {
          params.append('customReagentId', selectedReagentId);
        }
        
        const response = await fetch(`/api/lab/${selectedLab}/inventory?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          // Get the most recent batch number from existing inventory
          if (data.length > 0) {
            const latestBatch = data[0].batchNumber;
            if (latestBatch) {
              setBatchNumber(latestBatch);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching existing batch:', error);
      }
    }
    // Reset batch number if no reagent selected or no existing batch found
    setBatchNumber('');
  };

  fetchExistingBatch();
}, [selectedReagentId, reagentType, selectedLab, availableReagents]); // Add availableReagents dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!selectedReagentId) {
      alert('Please select a reagent');
      return;
    }
    
    if (!quantity || parseFloat(quantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        [reagentType === 'catalog' ? 'reagentId' : 'customReagentId']: selectedReagentId,
        quantity: parseFloat(quantity),
        batchNumber: batchNumber || null,
        expiryDate: expiryDate || null,
        increment: true
      };

      console.log({selectedLab})
      console.log({payload})
      const response = await fetch(`/api/lab/${selectedLab}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add reagent');
      }
      
      // Refresh data
      onReagentAdded();
      
      // Show success
      alert('Reagent added to inventory successfully!');
      
    } catch (error) {
      console.error('Error adding reagent:', error);
      alert(error instanceof Error ? error.message : 'Failed to add reagent');
    } finally {
      setLoading(false);
    }
  };

//   const handleDownload = async () => {
//     try {
//       // Refresh data before download
//       await onReagentAdded();

//       // Fetch inventory data
//       const response = await fetch(`/api/lab/${selectedLab}/inventory`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch inventory data');
//       }
//       const inventory = await response.json();

//       // Fetch catalog reagents
//       const catalogRes = await fetch('/api/reagents');
//       if (!catalogRes.ok) {
//         throw new Error('Failed to fetch reagent catalog');
//       }
//       const catalog = await catalogRes.json();

//       // Fetch custom reagents
//       const customRes = await fetch(`/api/lab/${selectedLab}/custom-reagents`);
//       if (!customRes.ok) {
//         throw new Error('Failed to fetch custom reagents');
//       }
//       const custom = await customRes.json();

//       // Helper to get reagent info
//       const getReagentInfo = (item: any) => {
//         if (item.reagentId) {
//           const reagent = catalog.find((r: any) => r.id === item.reagentId);
//           return {
//             reagentName: reagent?.name || '',
//             unit: reagent?.unit || '',
//             category: reagent?.category || '',
//           };
//         } else if (item.customReagentId) {
//           const reagent = custom.find((r: any) => r.id === item.customReagentId);
//           return {
//             reagentName: reagent?.name || '',
//             unit: reagent?.unit || '',
//             category: reagent?.category || '',
//           };
//         }
//         return { reagentName: '', unit: '', category: '' };
//       };

//       // Parse only required fields
//       const parsed = inventory.map((item: any) => {
//         const info = getReagentInfo(item);
//         return {
//           reagentName: info.reagentName,
//           category: info.category,  
//           stock: `${item.quantity} ${info.unit}`,
//           batchNumber: item.batchNumber,
//           expiryDate: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '',
//         };
//       });

//       // Convert JSON to worksheet
//       // Create worksheet and workbook
//       const worksheet = XLSX.utils.json_to_sheet(parsed);

//       // Style the header row (row 1)
// // Style the header row (row 1) up to a column range
// const headerKeys = Object.keys(parsed[0] || {});
// const headerStyleRange = headerKeys.length; // or set manually: e.g., 5
// for (let colIdx = 0; colIdx < headerStyleRange; colIdx++) {
//   const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIdx });
//   if (!worksheet[cellAddress]) continue;
//   worksheet[cellAddress].s = {
//     font: { bold: true, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "1E293B" } }, // dark blue background
//     alignment: { horizontal: "center", vertical: "center" },
//     border: {
//       top: { style: "thin", color: { rgb: "CCCCCC" } },
//       bottom: { style: "thin", color: { rgb: "CCCCCC" } },
//       left: { style: "thin", color: { rgb: "CCCCCC" } },
//       right: { style: "thin", color: { rgb: "CCCCCC" } },
//     },
//   };
// }


//       // Convert worksheet to a table (Excel Table)
//       const range = XLSX.utils.decode_range(worksheet['!ref']!);
//       // Add table headers
//       const table = {
//         name: 'InventoryTable',
//         ref: worksheet['!ref'],
//         headerRow: true,
//         totalsRow: false,
//         columns: Object.keys(parsed[0] || {}).map((k) => ({ name: k, filterButton: true })),
//         rows: [],
//       };
//       worksheet['!tables'] = [table];

//       // Autofit column widths
//       const colWidths = Object.keys(parsed[0] || {}).map((key) => {
//         // Find max length in this column
//         const maxLen = Math.max(
//           key.length,
//           ...parsed.map((row: any) => (row[key] ? String(row[key]).length : 0))
//         );
//         return { wch: maxLen + 2 }; // add padding
//       });
//       worksheet['!cols'] = colWidths;

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

//       // Generate Excel file and trigger download
//       const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
//       const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'inventory.xlsx';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       alert('Error downloading inventory: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     }
//   };

const handleDownload = async () => {
  try {
    // Refresh data before download
    await onReagentAdded();

    // Fetch inventory data
    const response = await fetch(`/api/lab/${selectedLab}/inventory`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory data');
    }
    const inventory = await response.json();

    // Fetch catalog reagents
    const catalogRes = await fetch('/api/reagents');
    if (!catalogRes.ok) {
      throw new Error('Failed to fetch reagent catalog');
    }
    const catalog = await catalogRes.json();

    // Fetch custom reagents
    const customRes = await fetch(`/api/lab/${selectedLab}/custom-reagents`);
    if (!customRes.ok) {
      throw new Error('Failed to fetch custom reagents');
    }
    const custom = await customRes.json();

    // Helper to get reagent info
    const getReagentInfo = (item: any) => {
      if (item.reagentId) {
        const reagent = catalog.find((r: any) => r.id === item.reagentId);
        return {
          reagentName: reagent?.name || '',
          unit: reagent?.unit || '',
          category: reagent?.category || '',
        };
      } else if (item.customReagentId) {
        const reagent = custom.find((r: any) => r.id === item.customReagentId);
        return {
          reagentName: reagent?.name || '',
          unit: reagent?.unit || '',
          category: reagent?.category || '',
        };
      }
      return { reagentName: '', unit: '', category: '' };
    };

    // Parse only required fields
    const parsed = inventory.map((item: any) => {
      const info = getReagentInfo(item);
      return {
        reagentName: info.reagentName,
        category: info.category,
        stock: `${item.quantity} ${info.unit}`,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '',
      };
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    // Define columns with headers and keys (keys must match parsed object keys)
    const columns = [
      { header: 'Reagent Name', key: 'reagentName', width: 20 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Stock', key: 'stock', width: 15 },
      { header: 'Batch Number', key: 'batchNumber', width: 15 },
      { header: 'Expiry Date', key: 'expiryDate', width: 15 },
    ];
    worksheet.columns = columns;

    // Add rows from parsed data
    parsed.forEach((item) => worksheet.addRow(item));

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }, // Dark blue background
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    // Auto-fit columns based on longest value (overwrite widths if needed)
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value;
        if (cellValue) {
          const length = cellValue.toString().length;
          if (length > maxLength) {
            maxLength = length;
          }
        }
      });
      column.width = maxLength + 2;
    });

    // Generate XLSX file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Trigger download
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    alert('Error downloading inventory: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};


  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-bold">
            Reagent Inventory
          </CardTitle>
          <CardDescription className="text-[#64748B] font-normal">
            Manage stock levels and track expiry dates
          </CardDescription>
        </div>
        <div className='ml-[550px]'>
          <Button onClick={()=>{handleDownload()}} className="bg-[#0F172A] text-white hover:bg-[#272E3F] p-6 text-md">
            <Download /> Download
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#0F172A] text-white hover:bg-[#272E3F] p-6 text-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`${font.className} bg-white border-[#F7F8F9] max-w-lg`}
          >
            <DialogHeader>
              <DialogTitle className="font-semibold text-xl">
                Add Reagent Stock
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add new stock for existing reagents
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reagent Type */}
              <div>
                <Label className='pb-1' htmlFor="reagentType">Reagent Type</Label>
                <Select value={reagentType} onValueChange={(value: 'catalog' | 'custom') => setReagentType(value)}>
                  <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                    <SelectValue placeholder="Select reagent type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                    <SelectItem value="catalog">Catalog Reagent</SelectItem>
                    <SelectItem value="custom">Custom Reagent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reagent select */}
              <div>
                <Label className='pb-1' htmlFor="reagent">Reagent</Label>
                <Select value={selectedReagentId} onValueChange={setSelectedReagentId}>
                  <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                    <SelectValue placeholder={`Select ${reagentType} reagent`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                    {availableReagents.map((reagent) => (
                      <SelectItem key={reagent.id} value={reagent.id}>
                        {reagent.name} {reagent.category && `(${reagent.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className='pb-1' htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="p-4 py-5 text-md border-[#dbdcdd]"
                    required
                  />
                </div>
                <div>
                  <Label className='pb-1' htmlFor="unit">Unit</Label>
                  <Select value={selectedReagent?.unit || ''} disabled={!!selectedReagent}>
                    <SelectTrigger className="border-[#dbdcdd] bg-white p-4 py-5 text-md">
                      <SelectValue placeholder={selectedReagent?.unit || "Select reagent first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                      {['ml', 'l', 'kit', 'vial'].map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expiry */}
              <div>
                <Label className='pb-1' htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="border-[#dbdcdd] text-md "
                />
              </div>

              {/* Batch */}
              <div>
                <Label className='pb-1' htmlFor="batch">Batch Number</Label>
                <Input
                  id="batch"
                  placeholder="BATCH2024001"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="border-[#dbdcdd] p-4 py-5 text-md"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading || !selectedReagentId || !quantity || parseFloat(quantity) <= 0}
              >
                {loading ? 'Adding...' : 'Add to Inventory'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  );
};