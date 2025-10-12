// components/inventory/tests/TestCatalog.tsx
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, PlusCircle, Trash2, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';

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

interface TestItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration?: string;
  reagents: {
    reagentId: string;
    quantity: number;
    unit: string;
  }[];
}

interface TestCatalogProps {
  sampleTestCatalog: TestItem[];
  inventory: InventoryItem[];
  selectedLab: string;
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
  onTestAdded: () => void;
  reagentCatalog: ReagentDetails[];
}

// New component for the Add Test Dialog Form
const AddTestForm = ({
  labId,
  onTestAdded,
  getReagentDetails,
  reagentCatalog,
}: {
  labId: string;
  onTestAdded: () => void;
  getReagentDetails: (reagentId: string) => ReagentDetails | undefined;
  reagentCatalog: ReagentDetails[];
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [reagents, setReagents] = useState<
    { reagentId: string; quantity: number; unit: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddReagent = () => {
    setReagents([...reagents, { reagentId: '', quantity: 0, unit: '' }]);
  };

  const handleRemoveReagent = (index: number) => {
    const newReagents = reagents.filter((_, i) => i !== index);
    setReagents(newReagents);
  };

  const handleReagentChange = (index: number, field: string, value: any) => {
    const newReagents = [...reagents];
    if (field === 'reagentId') {
      const selectedReagent = getReagentDetails(value);
      newReagents[index] = {
        ...newReagents[index],
        reagentId: value,
        unit: selectedReagent?.unit || '',
      };
    } else if (field === 'quantity') {
      newReagents[index] = {
        ...newReagents[index],
        quantity: parseFloat(value),
      };
    }
    setReagents(newReagents);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newTest = {
      name,
      category,
      duration,
      description,
      price: parseFloat(price),
      reagents: reagents.map((r) => ({
        reagentId: r.reagentId,
        quantityPerTest: r.quantity,
        unit: r.unit,
      })),
    };

    try {
      const response = await fetch(`/api/lab/${labId}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTest),
      });

      if (!response.ok) {
        throw new Error('Failed to create test.');
      }

      await response.json();
      onTestAdded();
      setOpen(false);
      setName('');
      setCategory('');
      setDuration('');
      setDescription('');
      setPrice('');
      setReagents([]);
      toast.success('Test added successfully!');
    } catch (error) {
      console.error('Error adding test:', error);
      toast.error('Failed to add test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold text-white bg-gradient-to-r from-[#036262] to-[#0A7A7A] hover:from-[#036262]/90 hover:to-[#0A7A7A]/90 transition-all duration-200 shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-white rounded-2xl shadow-xl border-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Add New Test
          </DialogTitle>
          <DialogDescription className="text-gray-600 font-medium">
            Fill in the details for the new test. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto space-y-6 px-1 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Test Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-gray-300 focus:border-[#036262] focus:ring-[#036262]"
                required
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-gray-700"
              >
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 border-gray-300 focus:border-[#036262] focus:ring-[#036262]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label
                htmlFor="duration"
                className="text-sm font-semibold text-gray-700"
              >
                Duration
              </Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 4 hours"
                className="h-11 border-gray-300 focus:border-[#036262] focus:ring-[#036262]"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-gray-700"
              >
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 border-gray-300 focus:border-[#036262] focus:ring-[#036262]"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] border-gray-300 focus:border-[#036262] focus:ring-[#036262]"
            />
          </div>

          <div className="space-y-4 border-2 border-dashed border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                Required Reagents
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReagent}
                className="border-[#036262] text-[#036262] hover:bg-[#036262] hover:text-white transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Reagent
              </Button>
            </div>

            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {reagents.map((reagent, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex-1">
                    <Label
                      htmlFor={`reagent-id-${index}`}
                      className="text-xs font-semibold text-gray-600 mb-2"
                    >
                      Reagent
                    </Label>
                    <select
                      id={`reagent-id-${index}`}
                      value={reagent.reagentId}
                      onChange={(e) =>
                        handleReagentChange(index, 'reagentId', e.target.value)
                      }
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#036262] focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select a reagent</option>
                      {reagentCatalog.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-28">
                    <Label
                      htmlFor={`quantity-${index}`}
                      className="text-xs font-semibold text-gray-600 mb-2"
                    >
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      step="0.01"
                      value={reagent.quantity}
                      onChange={(e) =>
                        handleReagentChange(index, 'quantity', e.target.value)
                      }
                      className="h-10 border-gray-300 focus:border-[#036262] focus:ring-[#036262]"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveReagent(index)}
                    className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <DialogFooter className="flex gap-3 pt-4 flex-shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-[#036262] to-[#0A7A7A] hover:from-[#036262]/90 hover:to-[#0A7A7A]/90 text-white shadow-md"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Test'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ---------- Test Catalog ----------
export function TestCatalog({
  sampleTestCatalog,
  inventory,
  selectedLab,
  getReagentDetails,
  onTestAdded,
  reagentCatalog,
}: TestCatalogProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Available Tests
            </CardTitle>
            <CardDescription className="font-medium text-gray-600 text-lg">
              View test catalog and reagent requirements
            </CardDescription>
          </div>
          <AddTestForm
            labId={selectedLab}
            onTestAdded={onTestAdded}
            getReagentDetails={getReagentDetails}
            reagentCatalog={reagentCatalog}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleTestCatalog.map((test) => {
            const allReagentsAvailable = test.reagents.every((reagent) => {
              const inventoryItem = inventory.find(
                (item) =>
                  item.reagentId === reagent.reagentId &&
                  item.labId === selectedLab
              );
              return (
                inventoryItem && inventoryItem.quantity >= reagent.quantity
              );
            });

            return (
              <Card
                key={test.id}
                className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden ${
                  allReagentsAvailable
                    ? 'border-l-4 border-l-emerald-500'
                    : 'border-l-4 border-l-rose-500'
                }`}
              >
                <CardHeader className="pb-4 bg-gradient-to-r from-white to-gray-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {test.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1"
                        variant="outline"
                      >
                        {test.category}
                      </Badge>
                      <Badge
                        variant={
                          allReagentsAvailable ? 'default' : 'destructive'
                        }
                        className={`font-semibold px-3 py-1 ${
                          allReagentsAvailable
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-rose-500 text-white shadow-sm'
                        }`}
                      >
                        {allReagentsAvailable ? 'Ready' : 'Insufficient Stock'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="font-medium text-gray-600 space-y-1">
                    {test.description && (
                      <p className="text-sm leading-relaxed">
                        {test.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm font-semibold text-gray-700">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration: {test.duration}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                      Required Reagents:
                    </h4>
                    <div className="space-y-3">
                      {test.reagents.map((reagent, index) => {
                        const reagentDetails = getReagentDetails(
                          reagent.reagentId
                        );
                        const inventoryItem = inventory.find(
                          (item) =>
                            item.reagentId === reagent.reagentId &&
                            item.labId === selectedLab
                        );
                        const available = inventoryItem
                          ? inventoryItem.quantity >= reagent.quantity
                          : false;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-sm"
                          >
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900 block">
                                {reagentDetails?.name || 'Unknown Reagent'}
                              </span>
                              <div className="text-xs text-gray-500 font-medium mt-1">
                                {reagentDetails?.category}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-md border">
                                {reagent.quantity} {reagent.unit}
                              </span>
                              {inventoryItem && (
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    available
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  {inventoryItem.quantity} {inventoryItem.unit}{' '}
                                  available
                                </span>
                              )}
                              {available ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-rose-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
