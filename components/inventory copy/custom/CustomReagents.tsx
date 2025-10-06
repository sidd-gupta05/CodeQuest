import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';

import { Plus, Package } from 'lucide-react';

interface CustomReagentSample {
  id: string;
  labId: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  reorderThreshold: number;
}

interface CustomReagentsProps {
  reagents: CustomReagentSample[];
  selectedLab: string;
  getStockStatus: (
    qty: number,
    threshold: number,
    expiry: string
  ) => { status: string; color: string; icon: React.ElementType };
}

// ---------- Custom Reagents ----------
export function CustomReagents({
  reagents,
  selectedLab,
  getStockStatus,
}: CustomReagentsProps) {
  const filtered = reagents.filter((r) => r.labId === selectedLab);

  return (
    <Card className="border-gray-100">
      <CardHeader className="border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">
              Custom Reagents
            </CardTitle>
            <CardDescription className="font-medium text-[#64748B]">
              Lab-specific reagents and solutions
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#0F172A] text-white hover:bg-[#272E3F] p-4 py-6 text-md">
                <Plus className="h-4 w-4 mr-2" /> Add Custom Reagent
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-[#F7F8F9] max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add Custom Reagent
                </DialogTitle>
                <DialogDescription className="font-medium text-[#838FA2]">
                  Create a lab-specific reagent
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Reagent Name</Label>
                  <Input
                    className="border-[#dbdcdd] p-4 py-5 text-md"
                    id="name"
                    placeholder="Custom Antibody Solution"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    className="border-[#dbdcdd] p-4 text-md"
                    id="description"
                    placeholder="Detailed description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input
                      className="border-[#dbdcdd] p-4 py-5 text-md"
                      id="quantity"
                      type="number"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select>
                      <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                        <SelectValue placeholder="ml" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="l">l</SelectItem>
                        <SelectItem value="kit">kit</SelectItem>
                        <SelectItem value="vial">vial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    className="border-[#dbdcdd] text-md"
                    id="expiry"
                    type="date"
                  />
                </div>
                <div>
                  <Label htmlFor="threshold">Reorder Threshold</Label>
                  <Input
                    className="border-[#dbdcdd] p-4 py-5 text-md"
                    id="threshold"
                    type="number"
                    placeholder="15"
                  />
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Add Custom Reagent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((r) => {
              const status = getStockStatus(
                r.quantity,
                r.reorderThreshold,
                r.expiryDate
              );
              const StatusIcon = status.icon;
              return (
                <Card
                  key={r.id}
                  className="border-l-4 border-gray-300 border-l-purple-500"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">
                        {r.name}
                      </CardTitle>
                      <Badge
                        variant={
                          status.color as
                            | 'default'
                            | 'secondary'
                            | 'destructive'
                            | 'outline'
                        }
                        className="flex items-center"
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="font-medium text-[#64748B]">
                      {r.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Stock:</span>
                        <p>
                          {r.quantity} {r.unit}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Expiry:</span>
                        <p>{r.expiryDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Threshold:</span>
                        <p>
                          {r.reorderThreshold} {r.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
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
