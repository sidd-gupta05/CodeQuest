// components/inventory/custom-reagents.tsx
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Plus, Beaker } from 'lucide-react';
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
  getStockStatus: (
    quantity: number,
    threshold: number,
    expiryDate?: string
  ) => any;
  onReagentAdded: () => void;
}

export function CustomReagents({
  reagents,
  selectedLab,
  getStockStatus,
  onReagentAdded,
}: CustomReagentsProps) {
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
    expiryDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.reorderThreshold &&
      parseFloat(formData.reorderThreshold) >
        parseFloat(formData.quantity || '0')
    ) {
      toast.error('Reorder threshold cannot exceed initial quantity');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/lab/${selectedLab}/custom-reagents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
          reorderThreshold: formData.reorderThreshold
            ? parseFloat(formData.reorderThreshold)
            : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create custom reagent');
      }

      setFormData({
        name: '',
        category: '',
        description: '',
        manufacturer: '',
        unit: 'ml',
        quantity: '',
        reorderThreshold: '',
        expiryDate: '',
      });

      onReagentAdded();
      toast.success('Custom reagent created successfully!');
    } catch (error) {
      console.error('Error creating custom reagent:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create custom reagent'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Custom Reagents
            </CardTitle>
            <CardDescription className="font-medium text-gray-600 text-lg">
              Manage lab-specific custom reagents
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 shadow-md hover:shadow-lg transition-all duration-200 font-semibold">
                <Plus className="h-5 w-5 mr-2" />
                Add Custom Reagent
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-0 shadow-2xl rounded-2xl max-w-lg">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Beaker className="h-6 w-6 mr-2 text-purple-600" />
                  Create Custom Reagent
                </DialogTitle>
                <DialogDescription className="font-medium text-gray-600">
                  Create a lab-specific reagent for your inventory
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    Reagent Name
                  </Label>
                  <Input
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                    id="name"
                    placeholder="Custom Antibody Solution"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="category"
                      className="text-sm font-semibold text-gray-700 mb-2 block"
                    >
                      Category
                    </Label>
                    <Input
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                      id="category"
                      placeholder="Haematology"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="unit"
                      className="text-sm font-semibold text-gray-700 mb-2 block"
                    >
                      Unit
                    </Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) =>
                        setFormData({ ...formData, unit: value })
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white">
                        <SelectValue placeholder="ml" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                        {['ml', 'l', 'kit', 'vial', 'mg', 'g', 'tablet'].map(
                          (u) => (
                            <SelectItem
                              key={u}
                              value={u}
                              className="focus:bg-purple-50"
                            >
                              {u}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="manufacturer"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    Manufacturer
                  </Label>
                  <Input
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                    id="manufacturer"
                    placeholder="BioLabs Inc."
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    Description
                  </Label>
                  <Input
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                    id="description"
                    placeholder="Detailed description of the reagent..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="quantity"
                      className="text-sm font-semibold text-gray-700 mb-2 block"
                    >
                      Initial Quantity
                    </Label>
                    <Input
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                      id="quantity"
                      placeholder="50"
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => {
                        const newQuantity = e.target.value;
                        setFormData((prev) => {
                          const newReorderThreshold =
                            prev.reorderThreshold &&
                            parseFloat(prev.reorderThreshold) >
                              parseFloat(newQuantity || '0')
                              ? ''
                              : prev.reorderThreshold;
                          return {
                            ...prev,
                            quantity: newQuantity,
                            reorderThreshold: newReorderThreshold,
                          };
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="reorderThreshold"
                      className="text-sm font-semibold text-gray-700 mb-2 block"
                    >
                      Reorder Threshold
                    </Label>
                    <Input
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                      id="reorderThreshold"
                      placeholder="15"
                      type="number"
                      step="0.01"
                      value={formData.reorderThreshold}
                      onChange={(e) => {
                        const newThreshold = e.target.value;
                        if (
                          !newThreshold ||
                          parseFloat(newThreshold) <=
                            parseFloat(formData.quantity || '0')
                        ) {
                          setFormData({
                            ...formData,
                            reorderThreshold: newThreshold,
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="expiryDate"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    Expiry Date
                  </Label>
                  <Input
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-gray-700"
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Custom Reagent'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.length > 0 ? (
            filtered.map((reagent) => {
              const status = getStockStatus(
                reagent.quantity || 0,
                reagent.reorderThreshold || 0,
                reagent.expiryDate
              );
              const StatusIcon = status.icon;

              return (
                <Card
                  key={reagent.id}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden border-l-4 border-l-purple-500"
                >
                  <CardHeader className="pb-4 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <Beaker className="h-5 w-5 mr-2 text-purple-600" />
                        {reagent.name}
                      </CardTitle>
                      <StatusIcon
                        className={`h-5 w-5 ${
                          status.status === 'good'
                            ? 'text-emerald-500'
                            : status.status === 'low-stock'
                              ? 'text-amber-500'
                              : 'text-rose-500'
                        }`}
                      />
                    </div>
                    <CardDescription className="font-medium text-gray-600">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                      >
                        {reagent.category || 'Uncategorized'}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">
                        Manufacturer:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {reagent.manufacturer || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">
                        Quantity:
                      </span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                        {reagent.quantity} {reagent.unit}
                      </span>
                    </div>
                    {reagent.reorderThreshold && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-600">
                          Reorder At:
                        </span>
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                          {reagent.reorderThreshold} {reagent.unit}
                        </span>
                      </div>
                    )}
                    {reagent.expiryDate && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-semibold text-gray-600">
                          Expires:
                        </span>
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(reagent.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 max-w-md mx-auto border-2 border-dashed border-gray-300">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No Custom Reagents
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any custom reagents yet.
                </p>
                <p className="text-sm text-gray-400">
                  Add lab-specific reagents using the button above to get
                  started.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
