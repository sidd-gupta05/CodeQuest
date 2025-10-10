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
import {
  Download,
  Plus,
  FileSpreadsheet,
  Calendar,
  Hash,
  Scale,
  Package,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { NextFont } from 'next/dist/compiled/@next/font';
import ExcelJS from 'exceljs';
import toast from 'react-hot-toast';

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
  onReagentAdded,
}: DialogHeaderProps) => {
  const [reagentType, setReagentType] = React.useState<'catalog' | 'custom'>(
    'catalog'
  );
  const [selectedReagentId, setSelectedReagentId] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [batchNumber, setBatchNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const availableReagents =
    reagentType === 'catalog' ? reagentCatalog : customReagents;
  const selectedReagent = availableReagents.find(
    (reagent) => reagent.id === selectedReagentId
  );

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
      const reagentExists = availableReagents.some(
        (reagent) => reagent.id === selectedReagentId
      );

      if (selectedReagentId && reagentExists) {
        try {
          // Build query parameters based on reagent type
          const params = new URLSearchParams();
          if (reagentType === 'catalog') {
            params.append('reagentId', selectedReagentId);
          } else {
            params.append('customReagentId', selectedReagentId);
          }

          const response = await fetch(
            `/api/lab/${selectedLab}/inventory?${params.toString()}`
          );
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
      toast('Please select a reagent');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast('Please enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        [reagentType === 'catalog' ? 'reagentId' : 'customReagentId']:
          selectedReagentId,
        quantity: parseFloat(quantity),
        batchNumber: batchNumber || null,
        expiryDate: expiryDate || null,
        increment: true,
      };

      console.log({ selectedLab });
      console.log({ payload });
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
      toast.success('Reagent added to inventory successfully!');
    } catch (error) {
      console.error('Error adding reagent:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add reagent'
      );
    } finally {
      setLoading(false);
    }
  };

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
          const reagent = custom.find(
            (r: any) => r.id === item.customReagentId
          );
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
          expiryDate: item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString()
            : '',
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
      parsed.forEach((item: any) => worksheet.addRow(item));

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
        if (typeof column.eachCell === 'function') {
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value;
            if (cellValue) {
              const length = cellValue.toString().length;
              if (length > maxLength) {
                maxLength = length;
              }
            }
          });
        }
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

      toast.success('Inventory report downloaded successfully!');
    } catch (error) {
      toast.error(
        'Error downloading inventory: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  return (
    <CardHeader className="px-0 pt-0">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Reagent Inventory
              </CardTitle>
              <CardDescription className="text-gray-600 font-normal text-base">
                Manage stock levels and track expiry dates
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleDownload}
            className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 h-12 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Export Excel
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 h-12 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                <Plus className="h-5 w-5 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`${font.className} bg-white border-gray-200 max-w-md rounded-2xl shadow-xl`}
            >
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="font-bold text-xl text-gray-900">
                      Add Reagent Stock
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-sm">
                      Add new stock for existing reagents
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Reagent Type */}
                <div className="space-y-2">
                  <Label
                    htmlFor="reagentType"
                    className="text-sm font-medium text-gray-700"
                  >
                    Reagent Type
                  </Label>
                  <Select
                    value={reagentType}
                    onValueChange={(value: 'catalog' | 'custom') =>
                      setReagentType(value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 w-full h-12 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Select reagent type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                      <SelectItem value="catalog" className="text-base py-3">
                        Catalog Reagent
                      </SelectItem>
                      <SelectItem value="custom" className="text-base py-3">
                        Custom Reagent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reagent select */}
                <div className="space-y-2">
                  <Label
                    htmlFor="reagent"
                    className="text-sm font-medium text-gray-700"
                  >
                    Reagent
                  </Label>
                  <Select
                    value={selectedReagentId}
                    onValueChange={setSelectedReagentId}
                  >
                    <SelectTrigger className="border-gray-300 w-full h-12 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                      <SelectValue
                        placeholder={`Select ${reagentType} reagent`}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg max-h-60">
                      {availableReagents.map((reagent) => (
                        <SelectItem
                          key={reagent.id}
                          value={reagent.id}
                          className="text-base py-3"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{reagent.name}</span>
                            {reagent.category && (
                              <span className="text-sm text-gray-500">
                                {reagent.category}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity + Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="quantity"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      placeholder="100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="unit"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Scale className="h-4 w-4" />
                      Unit
                    </Label>
                    <Select
                      value={selectedReagent?.unit || ''}
                      disabled={!!selectedReagent}
                    >
                      <SelectTrigger className="border-gray-300 bg-gray-50 h-12 text-base">
                        <SelectValue
                          placeholder={
                            selectedReagent?.unit || 'Select reagent first'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                        {['ml', 'l', 'kit', 'vial'].map((u) => (
                          <SelectItem
                            key={u}
                            value={u}
                            className="text-base py-3"
                          >
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Expiry */}
                <div className="space-y-2">
                  <Label
                    htmlFor="expiry"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Batch */}
                <div className="space-y-2">
                  <Label
                    htmlFor="batch"
                    className="text-sm font-medium text-gray-700"
                  >
                    Batch Number
                  </Label>
                  <Input
                    id="batch"
                    placeholder="BATCH2024001"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loading ||
                    !selectedReagentId ||
                    !quantity ||
                    parseFloat(quantity) <= 0
                  }
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding to Inventory...
                    </div>
                  ) : (
                    'Add to Inventory'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </CardHeader>
  );
};
