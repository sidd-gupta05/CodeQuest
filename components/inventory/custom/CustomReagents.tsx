// components/inventory/custom-reagents.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomReagent {
  id: string;
  labId: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  quantity?: number;
  reorderThreshold?: number;
}

interface CustomReagentsProps {
  reagents: CustomReagent[];
  selectedLab: string;
  getStockStatus: (quantity: number, threshold: number, expiryDate?: string) => any;
  onReagentAdded: () => void;
}

export function CustomReagents({ reagents, selectedLab, getStockStatus, onReagentAdded }: CustomReagentsProps) {
  const filtered = reagents.filter((r) => r.labId === selectedLab);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    manufacturer: '',
    unit: 'ml',
    quantity: '',
    reorderThreshold: '',
    expiryDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     // Validate reorder threshold
  if (formData.reorderThreshold && parseFloat(formData.reorderThreshold) > parseFloat(formData.quantity || '0')) {
    toast.error('Reorder threshold cannot exceed initial quantity');
    return;
  }
    setLoading(true);

    try {
      console.log({ formData,quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
          reorderThreshold: formData.reorderThreshold ? parseFloat(formData.reorderThreshold) : null,
         })
      const response = await fetch(`/api/lab/${selectedLab}/custom-reagents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
          reorderThreshold: formData.reorderThreshold ? parseFloat(formData.reorderThreshold) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create custom reagent');
      }

      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        manufacturer: '',
        unit: 'ml',
        quantity: '',
        reorderThreshold: '',
        expiryDate: ''
      });

      // Refresh data
      onReagentAdded();
      
      alert('Custom reagent created successfully!');
      
    } catch (error) {
      console.error('Error creating custom reagent:', error);
      alert(error instanceof Error ? error.message : 'Failed to create custom reagent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Custom Reagents</CardTitle>
            <CardDescription className="font-medium text-[#838FA2]">
              Manage lab-specific custom reagents
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#0F172A] text-white hover:bg-[#272E3F]">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Reagent
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-[#F7F8F9] max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create Custom Reagent</DialogTitle>
                <DialogDescription className="font-medium text-[#838FA2]">
                  Create a lab-specific reagent
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Reagent Name</Label>
                  <Input
                    className="border-[#dbdcdd] p-4 py-5 mt-1 text-md"
                    id="name" placeholder="Custom Antibody Solution"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                    className="border-[#dbdcdd] p-4 py-5 mt-1 text-md"
                      id="category" placeholder='Haematology'
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select 
                      defaultValue="ml"
                      value={formData.unit}
                      onValueChange={(value) => setFormData({...formData, unit: value})}
                    >
                      <SelectTrigger className="border-[#dbdcdd] bg-white p-4 py-5 mt-1 text-md">
                        <SelectValue placeholder="ml" />
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
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    className="mt-1 border-[#dbdcdd] p-4 py-5 text-md"
                    id="manufacturer" placeholder='BioLabs Inc.'
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    className="border-[#dbdcdd] p-4 py-5 mt-1 text-md"
                    id="description" 
                    placeholder="Detailed description..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input
                    className="border-[#dbdcdd] p-4 py-5 mt-1 text-md"
                      id="quantity" 
                      placeholder="50"
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => {
      const newQuantity = e.target.value;
      setFormData(prev => {
        // If reorder threshold is greater than new quantity, reset it
        const newReorderThreshold = prev.reorderThreshold && parseFloat(prev.reorderThreshold) > parseFloat(newQuantity || '0') 
          ? '' 
          : prev.reorderThreshold;
        return {...prev, quantity: newQuantity, reorderThreshold: newReorderThreshold};
      });
    }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reorderThreshold">Reorder Threshold</Label>
                    <Input
                    className="border-[#dbdcdd] p-4 py-5 mt-1 text-md"
                      id="reorderThreshold" placeholder='15'
                      type="number"
                      step="0.01"
                      value={formData.reorderThreshold}
                      onChange={(e) => {
      const newThreshold = e.target.value;
      // Only allow setting threshold if it's less than or equal to quantity
      if (!newThreshold || parseFloat(newThreshold) <= parseFloat(formData.quantity || '0')) {
        setFormData({...formData, reorderThreshold: newThreshold});
      }
    }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    className="border-[#dbdcdd]   text-md"
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-gray-800">
                  {loading ? 'Creating...' : 'Create Custom Reagent'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length > 0 ?(filtered.map((reagent) => {
            const status = getStockStatus(
              reagent.quantity || 0,
              reagent.reorderThreshold || 0,
              reagent.expiryDate
            );
            const StatusIcon = status.icon;

            return (
              <Card key={reagent.id} 
                  className="border-l-4 border-gray-300 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{reagent.name}</CardTitle>
                    <StatusIcon className={`h-4 w-4 ${
                      status.status === 'good' ? 'text-green-500' :
                      status.status === 'low-stock' ? 'text-orange-500' :
                      'text-red-500'
                    }`} />
                  </div>
                  <CardDescription className="font-medium text-[#64748B]">{reagent.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Manufacturer:</span>
                    <span>{reagent.manufacturer || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{reagent.quantity} {reagent.unit}</span>
                  </div>
                  {reagent.reorderThreshold && (
                    <div className="flex justify-between">
                      <span>Reorder At:</span>
                      <span>{reagent.reorderThreshold} {reagent.unit}</span>
                    </div>
                  )}
                  {reagent.expiryDate && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{new Date(reagent.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })) :
          (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom reagents added yet</p>
              <p className="text-sm">
                Add lab-specific reagents using the button above
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}