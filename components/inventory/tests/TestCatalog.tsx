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
import { CheckCircle, XCircle, PlusCircle, Trash2 } from 'lucide-react';
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
      alert('Test added successfully!');
    } catch (error) {
      console.error('Error adding test:', error);
      alert('Failed to add test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold text-white bg-[#036262] hover:bg-[#036262]/90 transition-colors duration-200">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Test</DialogTitle>
          <DialogDescription>
            Fill in the details for the new test. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Test Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (e.g., "4 hours")</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-semibold flex items-center justify-between">
              Required Reagents
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReagent}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Reagent
              </Button>
            </h4>
            {reagents.map((reagent, index) => (
              <div key={index} className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor={`reagent-id-${index}`}>Reagent</Label>
                  <select
                    id={`reagent-id-${index}`}
                    value={reagent.reagentId}
                    onChange={(e) =>
                      handleReagentChange(index, 'reagentId', e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="w-24">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    step="0.01"
                    value={reagent.quantity}
                    onChange={(e) =>
                      handleReagentChange(index, 'quantity', e.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveReagent(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
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
}: TestCatalogProps & { reagentCatalog: ReagentDetails[] }) {
  return (
    <Card className="border-gray-100 ">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold ">
              Available Tests
            </CardTitle>
            <CardDescription className="font-medium text-[#838FA2]">
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
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-gray-100">
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
                className={`border-gray-100  border-l-4 ${
                  allReagentsAvailable
                    ? 'border-l-green-500'
                    : 'border-l-red-500'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className="bg-[#F3F6FA] border-gray-100"
                        variant="outline"
                      >
                        {test.category}
                      </Badge>
                      <Badge
                        variant={
                          allReagentsAvailable ? 'default' : 'destructive'
                        }
                        className={
                          allReagentsAvailable
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }
                      >
                        {allReagentsAvailable ? 'Ready' : 'Insufficient Stock'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="font-medium text-[#838FA2]">
                    {test.description && (
                      <p className="mb-1">{test.description}</p>
                    )}
                    Duration: {test.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Required Reagents:</h4>
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
                          className="flex items-center justify-between text-sm p-2 rounded bg-gray-50"
                        >
                          <div>
                            <span className="font-medium">
                              {reagentDetails?.name || 'Unknown Reagent'}
                            </span>
                            <div className="text-xs text-gray-500">
                              {reagentDetails?.category}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              {reagent.quantity} {reagent.unit}
                            </span>
                            {inventoryItem && (
                              <span
                                className={`text-xs ${
                                  available ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                ({inventoryItem.quantity} {inventoryItem.unit}{' '}
                                available)
                              </span>
                            )}
                            {available ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
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
