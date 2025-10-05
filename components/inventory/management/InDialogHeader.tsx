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

// ---------- Types ----------
import { ReagentDetails } from '@/types/inventory';
interface DialogHeaderProps {
  font: NextFont;
  sampleReagentCatalog: ReagentDetails[];
}

export const InDialogHeader = ({
  font,
  sampleReagentCatalog,
}: DialogHeaderProps) => {
  return (
    <>
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
              <div className="space-y-4">
                {/* Reagent select */}
                <div>
                  <Label htmlFor="reagent">Reagent</Label>
                  <Select>
                    <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                      <SelectValue placeholder="Select reagent" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                      {sampleReagentCatalog.map((reagent: ReagentDetails) => (
                        <SelectItem key={reagent.id} value={reagent.id}>
                          {reagent.name}
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
                      placeholder="100"
                      className="p-4 py-5 text-md border-[#dbdcdd]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select>
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
                    className="border-[#dbdcdd] text-md"
                  />
                </div>
                {/* Batch */}
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    placeholder="BATCH2024001"
                    className="border-[#dbdcdd] p-4 py-5 text-md"
                  />
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Add to Inventory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </>
  );
};
