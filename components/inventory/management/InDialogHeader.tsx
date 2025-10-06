// components/inventory/in-dialog-header.tsx
import React from 'react';
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
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { NextFont } from 'next/dist/compiled/@next/font';

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
  const [reagentType, setReagentType] = React.useState<'catalog' | 'custom'>('catalog');
  const [selectedReagentId, setSelectedReagentId] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [batchNumber, setBatchNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        [reagentType === 'catalog' ? 'reagentId' : 'customReagentId']: selectedReagentId,
        quantity: parseFloat(quantity),
        batchNumber: batchNumber || null,
        expiryDate: expiryDate || null,
        increment: true
      };

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

      // Reset form
      setSelectedReagentId('');
      setQuantity('');
      setBatchNumber('');
      setExpiryDate('');
      
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

  const availableReagents = reagentType === 'catalog' ? reagentCatalog : customReagents;

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
                <Label htmlFor="reagentType">Reagent Type</Label>
                <Select value={reagentType} onValueChange={(value: 'catalog' | 'custom') => setReagentType(value)}>
                  <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                    <SelectValue placeholder="Select reagent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="catalog">Catalog Reagent</SelectItem>
                    <SelectItem value="custom">Custom Reagent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reagent select */}
              <div>
                <Label htmlFor="reagent">Reagent</Label>
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
                  <Label htmlFor="quantity">Quantity</Label>
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
                  <Label htmlFor="unit">Unit</Label>
                  <Select defaultValue="ml">
                    <SelectTrigger className="border-[#dbdcdd] p-4 py-5 text-md">
                      <SelectValue placeholder="ml" />
                    </SelectTrigger>
                    <SelectContent>
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
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="border-[#dbdcdd] text-md p-4 py-5"
                />
              </div>

              {/* Batch */}
              <div>
                <Label htmlFor="batch">Batch Number</Label>
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
                disabled={loading || !selectedReagentId || !quantity}
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